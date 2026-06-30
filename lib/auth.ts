import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { User } from "@prisma/client";
import { prisma } from "./prisma";
import { HttpError } from "./apiResponse";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";

function getSecret(): string {
  if (!JWT_SECRET) {
    throw new HttpError(500, "JWT_SECRET is not configured");
  }
  return JWT_SECRET;
}

export interface TokenPayload {
  sub: string;
  role: User["role"];
  email: string;
}

export function signToken(user: Pick<User, "id" | "role" | "email">): string {
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email } satisfies TokenPayload,
    getSecret(),
    { expiresIn: JWT_EXPIRES_IN },
  );
}

export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, getSecret()) as TokenPayload;
  } catch {
    throw new HttpError(401, "Invalid or expired token");
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function extractToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (header?.startsWith("Bearer ")) return header.slice(7).trim();
  return null;
}

// Resolve the authenticated user from the Bearer token, or throw 401.
export async function getAuthUser(request: Request): Promise<User> {
  const token = extractToken(request);
  if (!token) throw new HttpError(401, "Authentication required");
  const payload = verifyToken(token);
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || !user.isActive) {
    throw new HttpError(401, "Account not found or deactivated");
  }
  return user;
}

// Same as getAuthUser but additionally requires the admin role.
export async function requireAdmin(request: Request): Promise<User> {
  const user = await getAuthUser(request);
  if (user.role !== "admin") {
    throw new HttpError(403, "Admin access only");
  }
  return user;
}
