import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { ok, fail, handleError } from "@/lib/apiResponse";
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
    const { role } = (await request.json()) ?? {};
    if (role !== "user" && role !== "admin") {
      return fail(400, "Role must be 'user' or 'admin'");
    }

    const user = await prisma.user.update({ where: { id }, data: { role } });
    return ok(serializeUser(user), "Role updated");
  } catch (error) {
    return handleError(error);
  }
}
