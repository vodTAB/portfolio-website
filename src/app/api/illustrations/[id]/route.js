import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getAdminSession } from "@/lib/admin-auth";

export async function DELETE(request, { params }) {
  try {
    const session = await getAdminSession(request);

    if (!session) {
      return Response.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
      return Response.json(
        { error: "Invalid illustration ID." },
        { status: 400 }
      );
    }

    const { env } = await getCloudflareContext({ async: true });

    const illustration = await env.DB
      .prepare(
        `SELECT thumbnail_file_id, full_file_id
         FROM illustrations
         WHERE id = ?`
      )
      .bind(id)
      .first();

    if (!illustration) {
      return Response.json(
        { error: "Illustration not found." },
        { status: 404 }
      );
    }

    // Delete the database record first so it no longer appears in the portfolio.
    await env.DB
      .prepare("DELETE FROM illustrations WHERE id = ?")
      .bind(id)
      .run();

    // Then remove the associated files from R2.
    const keys = [
      illustration.thumbnail_file_id,
      illustration.full_file_id,
    ].filter(Boolean);

    if (keys.length > 0) {
      await env.IMAGES.delete(keys);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete illustration:", error);

    return Response.json(
      { error: "Failed to delete illustration." },
      { status: 500 }
    );
  }
}