import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { ok, handleError } from "@/lib/apiResponse";
import { serializeUser } from "@/lib/serialize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  try {
    const user = await getAuthUser(request);
    const { firstName, lastName, phoneNumber } = (await request.json()) ?? {};

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(firstName !== undefined ? { firstName } : {}),
        ...(lastName !== undefined ? { lastName } : {}),
        ...(phoneNumber !== undefined ? { phoneNumber } : {}),
      },
    });

    return ok(serializeUser(updated), "Profile updated");
  } catch (error) {
    return handleError(error);
  }
}
