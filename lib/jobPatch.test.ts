import assert from "node:assert/strict";
import { parseJobPatch } from "./jobPatch";

// Run: npx tsx lib/jobPatch.test.ts
assert.deepEqual(parseJobPatch({ name: "  ค่างวดรถ  " }), { ok: true, value: { name: "ค่างวดรถ" } });
assert.deepEqual(parseJobPatch({ cron: "0 12 5 * *", enabled: false }), { ok: true, value: { cron: "0 12 5 * *", enabled: false } });
assert.deepEqual(parseJobPatch({ cron: "@monthly" }), { ok: true, value: { cron: "@monthly" } });
for (const bad of [null, "x", [], {}, { name: "   " }, { name: "a".repeat(101) }, { cron: "0 12 5 *" }, { cron: "@often" }, { enabled: "true" }, { name: "x", id: "1" }])
  assert.equal(parseJobPatch(bad).ok, false, JSON.stringify(bad));
console.log("jobPatch ok");
