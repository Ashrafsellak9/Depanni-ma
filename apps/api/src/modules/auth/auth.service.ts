import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { UserRole } from "@depanni/types";

import type { AuthTokens } from "@depanni/types";
import { AuthLoginSchema, AuthRegisterSchema } from "@depanni/validators";

import { prisma } from "../../config/db.js";
import { env } from "../../config/env.js";
import { ConflictError, UnauthorizedError } from "../../utils/errors.js";
import type { AuthResult, LoginDto, RegisterDto, TokenPair } from "./auth.types.js";

const SALT_ROUNDS = 12;

interface TokenUser {
  id: string;
  email: string;
  role: UserRole;
}

function signTokens(user: TokenUser): AuthTokens {
  const accessOptions: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
  };
  const refreshOptions: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  };

  const accessToken = jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    env.JWT_SECRET,
    accessOptions,
  );

  const refreshToken = jwt.sign({ sub: user.id }, env.JWT_REFRESH_SECRET, refreshOptions);

  return { accessToken, refreshToken, expiresIn: 900 };
}

export class AuthService {
  async register(input: RegisterDto): Promise<AuthResult> {
    const data = AuthRegisterSchema.parse(input);

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { phone: data.phone }] },
    });
    if (existing) {
      throw new ConflictError("Email ou téléphone déjà utilisé");
    }

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        phone: data.phone,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        locale: data.locale ?? "fr",
      },
    });

    const tokens = signTokens({
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
    });
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role as UserRole,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      tokens,
    };
  }

  async login(input: LoginDto): Promise<AuthResult> {
    const data = AuthLoginSchema.parse(input);

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.identifier }, { phone: data.identifier }],
      },
    });

    if (!user) {
      throw new UnauthorizedError("Identifiants invalides");
    }

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError("Identifiants invalides");
    }

    const tokens = signTokens({
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
    });
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role as UserRole,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      tokens,
    };
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { sub: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!user) {
      throw new UnauthorizedError("Token invalide");
    }
    const tokens = signTokens({
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
    });
    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
  }
}

export const authService = new AuthService();
