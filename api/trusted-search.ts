import { globalSearchOrchestrator } from "../src/engine/searchOrchestrator";
import { ContentCategory } from "../src/engine/types";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
    return;
  }

  try {
    const query =
      req.method === "POST"
        ? req.body?.query || ""
        : new URL(req.url, "http://localhost").searchParams.get("q") || "";
    const categoryOverride =
      req.method === "POST"
        ? req.body?.category
        : (new URL(req.url, "http://localhost").searchParams.get("category") as
            | ContentCategory
            | undefined);
    const bypassCache =
      req.method === "POST"
        ? Boolean(req.body?.bypassCache)
        : new URL(req.url, "http://localhost").searchParams.get("bypassCache") === "true";

    if (!query || typeof query !== "string" || !query.trim()) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Missing required query parameter" }));
      return;
    }

    // Use server-side environment variable if configured; never expose secret in response
    const serverGeminiKey =
      (typeof process !== "undefined" &&
        (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY)) ||
      undefined;

    const result = await globalSearchOrchestrator.executeSearch({
      query: query.trim(),
      categoryOverride: categoryOverride || undefined,
      bypassCache,
      geminiApiKey: serverGeminiKey
    });

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store");
    res.end(JSON.stringify(result));
  } catch (err: any) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Server-side verification pipeline error",
        detail: err?.message || "Unknown error"
      })
    );
  }
}
