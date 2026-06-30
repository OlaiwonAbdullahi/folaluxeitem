import { prisma } from "@/lib/prisma";
import { getAuthUser, comparePassword, hashPassword } from "@/lib/auth";
import { ok, fail, handleError } from "@/lib/apiResponse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  try {
    const user = await getAuthUser(request);
    const { oldPassword, newPassword } = (await request.json()) ?? {};

    if (!oldPassword || !newPassword) {
      return fail(400, "oldPassword and newPassword are required");
    }
    if (String(newPassword).length < 6) {
      return fail(400, "New password must be at least 6 characters");
    }
    if (!(await comparePassword(oldPassword, user.passwordHash))) {
      return fail(401, "Current password is incorrect");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(newPassword) },
    });

    return ok(null, "Password changed");
  } catch (error) {
    return handleError(error);
  }
}
