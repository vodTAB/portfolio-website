
import { getAdminSession } from "@/lib/admin-auth";

export async function GET(request) {
  try {
    const session = await getAdminSession(request);

    if (!session) {
      return Response.json(
        { authenticated: false },
        {
          status: 401,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    return Response.json(
      { authenticated: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Session check failed:", error);

    return Response.json(
      { error: "Unable to check session." },
      { status: 500 }
    );
  }
}
