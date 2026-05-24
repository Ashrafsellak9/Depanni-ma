import bcrypt from "bcryptjs";
import type { Prisma, User } from "@prisma/client";

import type { UserRole } from "@depanni/types";

import { prisma } from "../../config/db.js";
import { getAccessTokenTtlSeconds } from "../../config/jwt.js";
import { processAndUploadImage, uploadRawFile } from "../../middleware/upload.js";
import { ConflictError, NotFoundError, UnauthorizedError } from "../../utils/errors.js";
import { otpService } from "./otp.service.js";
import { tokenService } from "./token.service.js";
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterArtisanInput,
  RegisterCitizenInput,
  ResetPasswordInput,
  VerifyOtpInput,
} from "./auth.schemas.js";
import type { AuthSessionResponse, AuthUserView, RegisterPendingResponse } from "./auth.types.js";

const SALT_ROUNDS = 12;

type UserWithProfiles = User & {
  citizen?: { id: string; firstName: string; lastName: string } | null;
  artisan?: { id: string; firstName: string; lastName: string } | null;
};

function buildArtisanCreateData(
  input: RegisterArtisanInput,
  kycUrls: string[],
): Prisma.ArtisanCreateWithoutUserInput {
  return {
    firstName: input.firstName,
    lastName: input.lastName,
    serviceRadiusKm: input.serviceRadiusKm,
    kycStatus: "PENDING",
    kycDocUrls: kycUrls,
    ...(input.cinNumber != null ? { cinNumber: input.cinNumber } : {}),
    ...(input.baseLat != null && input.baseLng != null
      ? { lat: input.baseLat, lng: input.baseLng }
      : {}),
  };
}

function toAuthUserView(user: UserWithProfiles): AuthUserView {
  const profile = user.citizen ?? user.artisan;
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    role: user.role as UserRole,
    firstName: profile?.firstName ?? "",
    lastName: profile?.lastName ?? "",
    isVerified: user.isVerified,
    citizenId: user.citizen?.id,
    artisanId: user.artisan?.id,
  };
}

const userSessionInclude = {
  citizen: { select: { id: true, firstName: true, lastName: true } },
  artisan: { select: { id: true, firstName: true, lastName: true } },
} as const;

export class AuthService {
  async registerCitizen(input: RegisterCitizenInput): Promise<RegisterPendingResponse> {
    const email = this.resolveCitizenEmail(input);
    const lastName = input.lastName?.trim() || "—";
    await this.assertUniqueContact(email, input.phone);

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email,
        phone: input.phone,
        passwordHash,
        role: "CITIZEN",
        locale: input.locale,
        isVerified: false,
        citizen: {
          create: {
            firstName: input.firstName,
            lastName,
          },
        },
      },
    });

    await otpService.send(input.phone, "REGISTER", input.locale);

    return {
      message: "Inscription initiée. Vérifiez le code OTP envoyé par SMS.",
      userId: user.id,
      phone: user.phone,
      otpSent: true,
    };
  }

  async registerArtisan(
    input: RegisterArtisanInput,
    files: {
      cinDocument?: Express.Multer.File[];
      tradeLicense?: Express.Multer.File[];
    },
  ): Promise<RegisterPendingResponse> {
    await this.assertUniqueContact(input.email, input.phone);

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    const kycDocUrls: string[] = [];
    const cinFile = files.cinDocument?.[0];
    const licenseFile = files.tradeLicense?.[0];

    if (cinFile) {
      kycDocUrls.push(await this.uploadKycFile(cinFile, "kyc/cin"));
    }
    if (licenseFile) {
      kycDocUrls.push(await this.uploadKycFile(licenseFile, "kyc/license"));
    }

    const user = await prisma.user.create({
      data: {
        email: input.email,
        phone: input.phone,
        passwordHash,
        role: "ARTISAN",
        locale: input.locale,
        isVerified: false,
        artisan: {
          create: buildArtisanCreateData(input, kycDocUrls),
        },
      },
      include: userSessionInclude,
    });

    if (input.baseLat != null && input.baseLng != null && user.artisan) {
      await prisma.$executeRaw`
        UPDATE artisans
        SET location = ST_SetSRID(ST_MakePoint(${input.baseLng}, ${input.baseLat}), 4326)::geography
        WHERE id = ${user.artisan.id}
      `;
    }

    await otpService.send(input.phone, "REGISTER", input.locale);

    return {
      message: "Inscription artisan initiée. Vérifiez le code OTP envoyé par SMS.",
      userId: user.id,
      phone: user.phone,
      otpSent: true,
    };
  }

  async verifyOtp(input: VerifyOtpInput): Promise<AuthSessionResponse> {
    await otpService.verify(input.phone, input.purpose, input.code);

    const user = await prisma.user.findUnique({
      where: { phone: input.phone },
      include: userSessionInclude,
    });

    if (!user) {
      throw new NotFoundError("Utilisateur");
    }

    if (input.purpose === "REGISTER" || input.purpose === "VERIFY_PHONE") {
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
        include: userSessionInclude,
      });

      const tokens = await tokenService.issueTokens(
        updated.id,
        updated.role as UserRole,
        updated.artisan?.id,
      );

      return this.buildSession(updated, tokens);
    }

    return {
      user: toAuthUserView(user),
      accessToken: "",
      expiresIn: getAccessTokenTtlSeconds(),
      refreshToken: "",
    };
  }

  async resendOtp(phone: string, purpose: VerifyOtpInput["purpose"], locale = "fr"): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      return { message: "Si le numéro existe, un code OTP a été envoyé." };
    }
    await otpService.send(phone, purpose, locale);
    return { message: "Code OTP renvoyé par SMS." };
  }

  async login(input: LoginInput): Promise<AuthSessionResponse> {
    const user = await prisma.user.findFirst({
      where: input.phone ? { phone: input.phone } : { email: input.email! },
      include: userSessionInclude,
    });

    if (!user) {
      throw new UnauthorizedError("Identifiants invalides");
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError("Identifiants invalides");
    }

    if (!user.isVerified) {
      throw new UnauthorizedError("Compte non activé. Vérifiez votre numéro par OTP.");
    }

    const tokens = await tokenService.issueTokens(
      user.id,
      user.role as UserRole,
      user.artisan?.id,
    );

    return this.buildSession(user, tokens);
  }

  async refresh(refreshToken: string): Promise<AuthSessionResponse> {
    const { verifyRefreshToken } = await import("../../config/jwt.js");
    const decoded = verifyRefreshToken(refreshToken);

    const tokens = await tokenService.rotateRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: userSessionInclude,
    });

    if (!user) {
      throw new UnauthorizedError("Utilisateur introuvable");
    }

    return this.buildSession(user, tokens);
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) return;

    try {
      const { verifyRefreshToken } = await import("../../config/jwt.js");
      const payload = verifyRefreshToken(refreshToken);
      await tokenService.revokeRefreshToken(payload.jti, refreshToken);
    } catch {
      // Token déjà invalide
    }
  }

  async forgotPassword(input: ForgotPasswordInput): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({ where: { phone: input.phone } });
    if (!user) {
      return { message: "Si le numéro existe, un code OTP a été envoyé." };
    }

    await otpService.send(input.phone, "RESET", user.locale);
    return { message: "Si le numéro existe, un code OTP a été envoyé." };
  }

  async resetPassword(input: ResetPasswordInput): Promise<{ message: string }> {
    await otpService.verify(input.phone, "RESET", input.code);

    const user = await prisma.user.findUnique({ where: { phone: input.phone } });
    if (!user) {
      throw new NotFoundError("Utilisateur");
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    await tokenService.revokeAllUserTokens(user.id);

    return { message: "Mot de passe mis à jour avec succès" };
  }

  async getMe(userId: string): Promise<AuthUserView> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: userSessionInclude,
    });
    if (!user) {
      throw new NotFoundError("Utilisateur");
    }
    return toAuthUserView(user);
  }

  private buildSession(
    user: UserWithProfiles,
    tokens: { accessToken: string; refreshToken: string; expiresIn: number },
  ): AuthSessionResponse {
    return {
      user: toAuthUserView(user),
      accessToken: tokens.accessToken,
      expiresIn: tokens.expiresIn,
      refreshToken: tokens.refreshToken,
    };
  }

  private async uploadKycFile(file: Express.Multer.File, folder: string): Promise<string> {
    if (file.mimetype === "application/pdf") {
      return (await uploadRawFile(file.buffer, folder, "application/pdf", "pdf")).url;
    }
    return (await processAndUploadImage(file.buffer, folder)).url;
  }

  private resolveCitizenEmail(input: RegisterCitizenInput): string {
    if (input.email) return input.email;
    const digits = input.phone.replace(/\D/g, "");
    return `citizen_${digits}@phone.depanni.ma`;
  }

  private async assertUniqueContact(email: string, phone: string): Promise<void> {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });
    if (existing) {
      throw new ConflictError("Email ou téléphone déjà utilisé");
    }
  }
}

export const authService = new AuthService();
