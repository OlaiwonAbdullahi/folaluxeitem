import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";
import { created, fail, handleError } from "@/lib/apiResponse";
import { serializeUser } from "@/lib/serialize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, phoneNumber } = body ?? {};

    if (!firstName || !lastName || !email || !password) {
      return fail(400, "firstName, lastName, email and password are required");
    }
    if (String(password).length < 6) {
      return fail(400, "Password must be at least 6 characters");
    }

    const existing = await prisma.user.findUnique({
      where: { email: String(email).toLowerCase() },
    });
    if (existing) return fail(409, "An account with this email already exists");

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: String(email).toLowerCase(),
        passwordHash: await hashPassword(password),
        phoneNumber: phoneNumber ?? "",
      },
    });

    const token = signToken(user);
    return created({ user: serializeUser(user), token }, "Account created");
  } catch (error) {
    return handleError(error);
  }
}
