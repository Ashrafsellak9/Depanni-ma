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

function buildArtisanCreateData(
  input: RegisterArtisanInput,
  kyc: { cinDocumentUrl?: string; tradeLicenseUrl?: string },
): Prisma.ArtisanCreateWithoutUserInput {
  return {
    serviceRadiusKm: input.serviceRadiusKm,
    verificationStatus: "PENDING",
    ...(input.cinNumber != null ? { cinNumber: input.cinNumber } : {}),
    ...(kyc.cinDocumentUrl != null ? { cinDocumentUrl: kyc.cinDocumentUrl } : {}),
    ...(kyc.tradeLicenseUrl != null ? { tradeLicenseUrl: kyc.tradeLicenseUrl } : {}),
    ...(input.baseLat != null && input.baseLng != null
      ? { baseLat: input.baseLat, baseLng: input.baseLng }
      : {}),
  };
}

function toAuthUserView(
  user: User & { artisan?: { id: string } | null },
): AuthUserView {
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    role: user.role as UserRole,
    firstName: user.firstName,
    lastName: user.lastName,
    status: user.status,
    phoneVerified: user.phoneVerified,
    emailVerified: user.emailVerified,
    artisanId: user.artisan?.id,
  };
}

export class AuthService {
  async registerCitizen(input: RegisterCitizenInput): Promise<RegisterPendingResponse> {
    await this.assertUniqueContact(input.email, input.phone);

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        phone: input.phone,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        role: "CITIZEN",
        locale: input.locale,
        status: "PENDING",
        phoneVerified: false,
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

    let cinDocumentUrl: string | undefined;
    let tradeLicenseUrl: string | undefined;

    const cinFile = files.cinDocument?.[0];
    const licenseFile = files.tradeLicense?.[0];

    if (cinFile) {
      cinDocumentUrl = await this.uploadKycFile(cinFile, "kyc/cin");
    }

    if (licenseFile) {
      tradeLicenseUrl = await this.uploadKycFile(licenseFile, "kyc/license");
    }

    const user = await prisma.user.create({
      data: {
        email: input.email,
        phone: input.phone,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        role: "ARTISAN",
        locale: input.locale,
        status: "PENDING",
        phoneVerified: false,
        artisan: {
          create: buildArtisanCreateData(input, { cinDocumentUrl, tradeLicenseUrl }),
        },
      },
      include: { artisan: true },
    });

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
      include: { artisan: true },
    });

    if (!user) {
      throw new NotFoundError("Utilisateur");
    }

    if (input.purpose === "REGISTER" || input.purpose === "VERIFY_PHONE") {
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: { phoneVerified: true, status: "ACTIVE" },
        include: { artisan: true },
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

  async login(input: LoginInput): Promise<AuthSessionResponse> {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: { artisan: true },
    });

    if (!user) {
      throw new UnauthorizedError("Identifiants invalides");
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError("Identifiants invalides");
    }

    if (user.status !== "ACTIVE") {
      throw new UnauthorizedError("Compte non activé. Vérifiez votre numéro par OTP.");
    }

    if (!user.phoneVerified) {
      throw new UnauthorizedError("Téléphone non vérifié");
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
      include: { artisan: true },
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
      // Token déjà invalide — rien à faire
    }
  }

  async forgotPassword(input: ForgotPasswordInput): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({ where: { phone: input.phone } });
    if (!user) {
      return { message: "Si le numéro existe, un code OTP a été envoyé." };
    }

    await otpService.send(input.phone, "RESET_PASSWORD", user.locale);
    return { message: "Si le numéro existe, un code OTP a été envoyé." };
  }

  async resetPassword(input: ResetPasswordInput): Promise<{ message: string }> {
    await otpService.verify(input.phone, "RESET_PASSWORD", input.code);

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
      include: { artisan: true },
    });
    if (!user) {
      throw new NotFoundError("Utilisateur");
    }
    return toAuthUserView(user);
  }

  private buildSession(
    user: User & { artisan?: { id: string } | null },
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
