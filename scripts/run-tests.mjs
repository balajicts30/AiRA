import { createServer } from "vite";

async function main() {
  const server = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "error"
  });

  try {
    const mod = await server.ssrLoadModule("/src/engine/__tests__/trustedEngine.test.ts");
    const report = await mod.runAllEngineTests();

    console.log("================================================================================");
    console.log("  AiRA TRUSTED LIVE DATA SOURCING & VERIFICATION ENGINE — TEST SUITE REPORT");
    console.log("================================================================================");
    for (const r of report.results) {
      const icon = r.passed ? "PASS" : "FAIL";
      console.log(`[${icon}] [${r.suite}] ${r.name}`);
      if (!r.passed && r.error) {
        console.error(`       -> ${r.error}`);
      }
    }
    console.log("--------------------------------------------------------------------------------");
    console.log(`Total: ${report.total} | Passed: ${report.passed} | Failed: ${report.failed}`);
    console.log("================================================================================");

    await server.close();
    process.exit(report.failed > 0 ? 1 : 0);
  } catch (err) {
    console.error("Test runner error:", err);
    await server.close();
    process.exit(1);
  }
}

main();
