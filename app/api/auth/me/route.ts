import { getAuthUser } from "@/lib/auth";
import { ok, handleError } from "@/lib/apiResponse";
import { serializeUser } from "@/lib/serialize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    return ok(serializeUser(user));
  } catch (error) {
    return handleError(error);
  }
}
