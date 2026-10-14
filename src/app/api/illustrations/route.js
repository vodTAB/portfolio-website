import { getCloudflareContext } from "@opennextjs/cloudflare";
import { randomUUID } from "node:crypto";
import { getAdminSession } from "@/lib/admin-auth";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function jsonError(message, status) {
  return Response.json({ error: message }, { status });
}

function isImageFile(file) {
  return (
    file instanceof File &&
    ALLOWED_TYPES.includes(file.type) &&
    file.size > 0 &&
    file.size <= MAX_IMAGE_SIZE
  );
}

export async function GET() {
  try {
    const { env } = await getCloudflareContext({ async: true });

    const { results } = await env.DB
      .prepare(
        `SELECT id, title, description, date, tools, sort_order,
                thumbnail_file_id, full_file_id, social_link,
                created_at, updated_at
         FROM illustrations
         ORDER BY sort_order ASC`
      )
      .all();

    const illustrations = results.map((row) => ({
      ...row,
      tools: row.tools ? JSON.parse(row.tools) : [],
      thumbnail_url: row.thumbnail_file_id
        ? `/api/illustrations/${row.id}/thumbnail`
        : null,
    }));

    return Response.json(illustrations, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Failed to fetch illustrations:", error);
    return jsonError("Failed to fetch illustrations.", 500);
  }
}

export async function POST(request) {
  let thumbnailKey;
  let fullImageKey;

  try {
    const session = await getAdminSession(request);

    if (!session) {
      return jsonError("Unauthorized.", 401);
    }

    const { env } = await getCloudflareContext({ async: true });

    if (!env.DB || !env.IMAGES) {
      return jsonError("Database or image storage is not configured.", 500);
    }

    const formData = await request.formData();

    const title = formData.get("title");
    const description = formData.get("description") || "";
    const date = formData.get("date") || "";
    const toolsValue = formData.get("tools") || "[]";
    const sortOrderValue = formData.get("sort_order") || "0";
    const socialLink = formData.get("social_link") || "";
    const thumbnail = formData.get("thumbnail");
    const fullImage = formData.get("fullImage");

    if (typeof title !== "string" || !title.trim()) {
      return jsonError("A title is required.", 400);
    }

    if (title.trim().length > 255) {
      return jsonError("The title must be 255 characters or fewer.", 400);
    }

    if (
      typeof description !== "string" ||
      description.length > 1000 ||
      typeof date !== "string" ||
      date.length > 50 ||
      typeof socialLink !== "string"
    ) {
      return jsonError("One or more fields are invalid.", 400);
    }

    let tools;

    try {
      tools = JSON.parse(toolsValue);
    } catch {
      return jsonError("Tools must be a valid JSON array.", 400);
    }

    if (
      !Array.isArray(tools) ||
      !tools.every((tool) => typeof tool === "string") ||
      toolsValue.length > 100
    ) {
      return jsonError("Tools must be an array of strings no longer than 100 characters when serialized.", 400);
    }

    const sortOrder = Number(sortOrderValue);

    if (!Number.isInteger(sortOrder)) {
      return jsonError("Sort order must be an integer.", 400);
    }

    if (!isImageFile(thumbnail) || !isImageFile(fullImage)) {
      return jsonError(
        "Please provide a thumbnail and full image in JPG, PNG, WebP, or GIF format. Each must be under 10 MB.",
        400
      );
    }

    const id = randomUUID();
    thumbnailKey = `${id}/thumbnail`;
    fullImageKey = `${id}/full`;

    await env.IMAGES.put(thumbnailKey, await thumbnail.arrayBuffer(), {
      httpMetadata: { contentType: thumbnail.type },
    });

    await env.IMAGES.put(fullImageKey, await fullImage.arrayBuffer(), {
      httpMetadata: { contentType: fullImage.type },
    });

    await env.DB
      .prepare(
        `INSERT INTO illustrations (
          id, title, description, date, tools, sort_order,
          thumbnail_file_id, full_file_id, social_link
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        title.trim(),
        description,
        date,
        JSON.stringify(tools),
        sortOrder,
        thumbnailKey,
        fullImageKey,
        socialLink
      )
      .run();

    return Response.json(
      {
        success: true,
        illustration: {
          id,
          title: title.trim(),
          description,
          date,
          tools,
          sort_order: sortOrder,
          thumbnail_file_id: thumbnailKey,
          full_file_id: fullImageKey,
          social_link: socialLink,
          thumbnail_url: `/api/illustrations/${id}/thumbnail`,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create illustration:", error);

    // Remove uploaded files if saving the record fails.
    try {
      const { env } = await getCloudflareContext({ async: true });
      if (thumbnailKey) await env.IMAGES?.delete(thumbnailKey);
      if (fullImageKey) await env.IMAGES?.delete(fullImageKey);
    } catch (cleanupError) {
      console.error("Failed to clean up uploaded images:", cleanupError);
    }

    return jsonError("Failed to create illustration.", 500);
  }
}