import { globalSearchOrchestrator } from "../src/engine/searchOrchestrator";
import { globalSourceRegistry } from "../src/engine/sourceRegistry";

export default async function handler(req: any, res: any) {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET") {
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        sources: globalSourceRegistry.getAllSources(),
        rejectedLogs: globalSourceRegistry.getRejectedLogs(50),
        auditTrail: globalSourceRegistry.getAuditTrail(50)
      })
    );
    return;
  }

  if (req.method === "POST") {
    const body = req.body || {};
    const { action, sourceId, status, adminNotes, maxContentAgeMs, maxCacheDurationMs, health, newSource } = body;

    if (action === "updateStatus" && sourceId && status) {
      const out = globalSourceRegistry.updateSourceStatus(sourceId, status, adminNotes, "admin_api");
      globalSearchOrchestrator.invalidateCache();
      res.statusCode = out.success ? 200 : 400;
      res.end(JSON.stringify(out));
      return;
    }

    if (action === "updateFreshness" && sourceId) {
      const out = globalSourceRegistry.updateFreshnessRequirements(
        sourceId,
        Number(maxContentAgeMs),
        Number(maxCacheDurationMs),
        "admin_api"
      );
      globalSearchOrchestrator.invalidateCache();
      res.statusCode = out.success ? 200 : 400;
      res.end(JSON.stringify(out));
      return;
    }

    if (action === "setHealth" && sourceId && health) {
      const out = globalSourceRegistry.setIntegrationHealth(sourceId, health, "admin_api");
      globalSearchOrchestrator.invalidateCache();
      res.statusCode = out.success ? 200 : 400;
      res.end(JSON.stringify(out));
      return;
    }

    if (action === "addSource" && newSource) {
      const out = globalSourceRegistry.addSource(newSource, "admin_api");
      globalSearchOrchestrator.invalidateCache();
      res.statusCode = out.success ? 200 : 400;
      res.end(JSON.stringify(out));
      return;
    }

    res.statusCode = 400;
    res.end(JSON.stringify({ error: "Unsupported registry action" }));
    return;
  }

  res.statusCode = 405;
  res.end(JSON.stringify({ error: "Method Not Allowed" }));
}
