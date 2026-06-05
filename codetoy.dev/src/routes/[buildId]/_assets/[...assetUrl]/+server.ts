export async function GET(event) {
  const url = new URL(event.request.url);
  const assetPath = url.pathname.replace("/_assets/", "");
  return serveAsset(assetPath, "image/png");
}

async function getMimeType(assetPath: string): Promise<string> {
  const extension = assetPath.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "png":
      return "image/png";
    case "svg":
      return "image/svg+xml";
    case "ico":
      return "image/x-icon";
    default:
      return "application/octet-stream";
  }
}

// TODO: Use assets from developer
async function serveAsset(assetPath: string, contentType: string) {
  try {
    const asset = await import(`$lib/assets/${assetPath}`);
    return new Response(asset.default, {
      headers: {
        "Content-Type": contentType
      }
    });
  } catch (error) {
    return new Response("Not Found", { status: 404 });
  }
}