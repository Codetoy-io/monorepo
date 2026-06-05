import supabase from "$lib/supabase/index.server";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

const ALLOWED_ARTIFACTS = {
  "build.wasm": { path: "build/build.wasm", contentType: "application/wasm" },
  "instantiate.js": { path: "build/instantiate.js", contentType: "text/javascript" },
} as const;

export const GET: RequestHandler = async ({ params }) => {
  const { buildId, artifact } = params;

  const allowed = ALLOWED_ARTIFACTS[artifact as keyof typeof ALLOWED_ARTIFACTS];
  if (!allowed) throw error(404, "Not found");

  const { data, error: downloadErr } = await supabase.storage
    .from(`build-${buildId}`)
    .download(allowed.path);

  if (downloadErr || !data) throw error(404, "Build not found");

  console.log("allowed", allowed)
  console.log("data", data)

  return new Response(data, {
    headers: {
      "Content-Type": allowed.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};