import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { ok, handleError } from "@/lib/apiResponse";
import { serializeUser } from "@/lib/serialize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const user = await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
    return ok(serializeUser(user), "User deactivated");
  } catch (error) {
    return handleError(error);
  }
}
