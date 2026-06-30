import { prisma } from "@/lib/prisma";
import { comparePassword, signToken } from "@/lib/auth";
import { ok, fail, handleError } from "@/lib/apiResponse";
import { serializeUser } from "@/lib/serialize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) ?? {};
    if (!email || !password) {
      return fail(400, "Email and password are required");
    }

    const user = await prisma.user.findUnique({
      where: { email: String(email).toLowerCase() },
    });
    if (!user || !(await comparePassword(password, user.passwordHash))) {
      return fail(401, "Invalid email or password");
    }
    if (!user.isActive) return fail(403, "Account is deactivated");

    const token = signToken(user);
    return ok({ user: serializeUser(user), token }, "Logged in");
  } catch (error) {
    return handleError(error);
  }
}
