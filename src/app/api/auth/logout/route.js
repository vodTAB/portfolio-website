
import { clearSessionCookie } from "@/lib/admin-auth";

export async function POST(request) {
  return Response.json(
    { success: true },
    {
      headers: {
        "Set-Cookie": clearSessionCookie(request),
        "Cache-Control": "no-store",
      },
    }
  );
}
