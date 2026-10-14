
import {
  createSessionToken,
  getAuthEnvironment,
  getSessionCookie,
} from "@/lib/admin-auth";

export async function POST(request) {
  try {
    const env = await getAuthEnvironment();

    if (
      !env.ADMIN_EMAIL ||
      !env.ADMIN_PASSWORD ||
      !env.SESSION_SECRET
    ) {
      console.error("Admin authentication secrets are missing.");

      return Response.json(
        { error: "Authentication is not configured." },
        { status: 500 }
      );
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: "Invalid request." },
        { status: 400 }
      );
    }

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    const expectedEmail = env.ADMIN_EMAIL.trim().toLowerCase();

    if (
      email !== expectedEmail ||
      password !== env.ADMIN_PASSWORD
    ) {
      return Response.json(
        { error: "Invalid email or password." },
        {
          status: 401,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    const token = await createSessionToken(
      expectedEmail,
      env.SESSION_SECRET
    );

    return Response.json(
      { success: true },
      {
        headers: {
          "Set-Cookie": getSessionCookie(request, token),
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Login failed:", error);

    return Response.json(
      { error: "Unable to sign in." },
      { status: 500 }
    );
  }
}
