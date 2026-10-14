import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(request, { params }) {
  try {
    const { id, kind } = await params;

    // Only allow the two image types we store in R2.
    if (
      !/^[0-9a-f-]{36}$/i.test(id) ||
      !["thumbnail", "full"].includes(kind)
    ) {
      return Response.json(
        { error: "Image not found." },
        { status: 404 }
      );
    }

    const { env } = await getCloudflareContext({ async: true });

    const object = await env.IMAGES.get(`${id}/${kind}`);

    if (!object) {
      return Response.json(
        { error: "Image not found." },
        { status: 404 }
      );
    }

    return new Response(object.body, {
      headers: {
        "Content-Type":
          object.httpMetadata?.contentType || "application/octet-stream",
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Failed to retrieve illustration image:", error);

    return Response.json(
      { error: "Failed to retrieve image." },
      { status: 500 }
    );
  }
}