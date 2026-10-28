import assert from "node:assert/strict";
import { CRON_FALLBACK as F, describeCron, nextRun, runDaysInMonth } from "./cron";

// Run: npx tsx lib/cron.test.ts  (exits non-zero on any mismatch)
const cases: [string, string][] = [
  ["* * * * *", "ทำงานทุกๆ 1 นาที"],
  ["*/5 * * * *", "ทำงานทุกๆ 5 นาที"],
  ["0 * * * *", "ทำงานทุกชั่วโมง ตรงนาทีที่ 0"],
  ["0,30 * * * *", "ทำงานทุกชั่วโมง ตรงนาทีที่ 0 และ 30"],
  ["0 */2 * * *", "ทำงานทุกๆ 2 ชั่วโมง ตรงนาทีที่ 0"],
  ["0 12 * * *", "ทำงานทุกวัน เวลา 12:00"],
  ["0 0 * * *", "ทำงานทุกวัน เวลา 00:00"],
  ["@daily", "ทำงานทุกวัน เวลา 00:00"],
  ["0 9,17 * * *", "ทำงานทุกวัน เวลา 09:00 และ 17:00"],
  ["0 9 * * 1-5", "ทำงานวันจันทร์–ศุกร์ เวลา 09:00"],
  ["0 9 * * mon-fri", "ทำงานวันจันทร์–ศุกร์ เวลา 09:00"],
  ["0 8 * * 1", "ทำงานทุกวันจันทร์ เวลา 08:00"],
  ["0 8 * * MON", "ทำงานทุกวันจันทร์ เวลา 08:00"],
  ["30 9 * * 1,3,5", "ทำงานทุกวันจันทร์, วันพุธ และวันศุกร์ เวลา 09:30"],
  ["0 10 * * 6,0", "ทำงานทุกวันเสาร์ และวันอาทิตย์ เวลา 10:00"],
  ["0 12 1 * *", "ทำงานทุกวันที่ 1 ของเดือน เวลา 12:00"],
  ["0 12 1,15 * *", "ทำงานทุกวันที่ 1 และ 15 ของเดือน เวลา 12:00"],
  ["0 0 1 1 *", "ทำงานทุกวันที่ 1 ของเดือน เวลา 00:00 เฉพาะเดือนมกราคม"],
  ["0 9 * 1,7 *", "ทำงานทุกวัน เวลา 09:00 เฉพาะเดือนมกราคม และเดือนกรกฎาคม"],
  ["0 9-17 * * 1-5", "ทำงานวันจันทร์–ศุกร์ ทุกชั่วโมง ตั้งแต่ 09:00 ถึง 17:00"],
  ["*/5 9-17 * * *", "ทำงานทุกๆ 5 นาที ในช่วง 09:00–17:59"],
  ["* 9 * * *", "ทำงานทุกๆ 1 นาที ในช่วง 09:00–09:59"],
  ["*/5 * * * 1-5", "ทำงานวันจันทร์–ศุกร์ ทุกๆ 5 นาที"],
  ["  0   12 * * * ", "ทำงานทุกวัน เวลา 12:00"],
  // extras
  ["@hourly", "ทำงานทุกชั่วโมง ตรงนาทีที่ 0"],
  ["@weekly", "ทำงานทุกวันอาทิตย์ เวลา 00:00"],
  ["@monthly", "ทำงานทุกวันที่ 1 ของเดือน เวลา 00:00"],
  ["@YEARLY", "ทำงานทุกวันที่ 1 ของเดือน เวลา 00:00 เฉพาะเดือนมกราคม"],
  ["0 9 * * 7", "ทำงานทุกวันอาทิตย์ เวลา 09:00"],
  ["0 9 * * 5-7", "ทำงานวันศุกร์–อาทิตย์ เวลา 09:00"],
  ["0,30 9,17 * * *", "ทำงานทุกวัน เวลา 09:00, 09:30, 17:00 และ 17:30"],
  ["0 9 * jan-mar *", "ทำงานทุกวัน เวลา 09:00 เฉพาะเดือนมกราคม–มีนาคม"],
  ["0 9 1-5 * *", "ทำงานทุกวันที่ 1–5 ของเดือน เวลา 09:00"],
  // fallbacks
  ["", F],
  ["foo", F],
  ["* * * *", F],
  ["* * * * * *", F],
  ["60 * * * *", F],
  ["0 24 * * *", F],
  ["0 12 15 * 1", F],
  ["0 12 L * *", F],
  ["5-10 * * * *", F],
  ["0 9 * * 8", F],
  ["*/0 * * * *", F],
  ["0 0 */2 * *", F],
  ["*/7 * * * *", F], // does not divide 60: would misfire at the hour boundary
  ["* */2 * * *", F],
  ["0 9-17/2 * * *", F],
  ["0 22-3 * * *", F],
  ["0 9 * * 0-7", F],
  ["0 0 1,2,3,4,5,6,7 * *", F],
  ["0 9 * * 1#2", F],
  ["0 9 * * ?", F],
  ["@reboot", F],
  ["0 9,17 * * 1,,2", F],
  ["0 9 * * FOO", F],
];

let ok = 0;
for (const [input, want] of cases) {
  assert.equal(describeCron(input), want, `describeCron(${JSON.stringify(input)})`);
  ok++;
}
console.log(`cron: ${ok}/${cases.length} passed`);

const at = (s: string) => new Date(s);
const iso = (d: Date | null) => d?.toISOString() ?? null;
assert.equal(iso(nextRun("0 12 5 * *", at("2026-10-29T07:00:00Z"))), "2026-11-05T05:00:00.000Z");
assert.equal(iso(nextRun("0 12 5 * *", at("2026-11-05T05:00:00Z"))), "2026-12-05T05:00:00.000Z"); // strictly after
assert.equal(iso(nextRun("0 12 31 * *", at("2026-11-01T00:00:00Z"))), "2026-12-31T05:00:00.000Z"); // Nov has 30 days
assert.equal(iso(nextRun("0 9 * * 1-5", at("2026-10-30T03:00:00Z"))), "2026-11-02T02:00:00.000Z"); // Fri 10:00 -> Mon 09:00
assert.equal(iso(nextRun("*/15 * * * *", at("2026-10-29T07:07:00Z"))), "2026-10-29T07:15:00.000Z");
assert.equal(iso(nextRun("0 0 1 1,7 *", at("2026-10-29T00:00:00Z"))), "2026-12-31T17:00:00.000Z");
assert.equal(iso(nextRun("@monthly", at("2026-10-29T00:00:00Z"))), "2026-10-31T17:00:00.000Z");
assert.equal(nextRun("0 12 L * *", at("2026-10-29T00:00:00Z")), null);
assert.deepEqual(runDaysInMonth("0 12 5 * *", 2026, 11), [5]);
assert.deepEqual(runDaysInMonth("0 9 * * 1-5", 2026, 11), [2,3,4,5,6,9,10,11,12,13,16,17,18,19,20,23,24,25,26,27,30]);
assert.deepEqual(runDaysInMonth("0 12 31 * *", 2026, 11), []);
assert.deepEqual(runDaysInMonth("*/5 * * * *", 2026, 2), Array.from({ length: 28 }, (_, i) => i + 1));
assert.deepEqual(runDaysInMonth("0 0 1 1,7 *", 2026, 11), []);
assert.equal(runDaysInMonth("0 12 L * *", 2026, 11), null);
// dow 7 == Sunday inside ranges and lists
const sundays = [1, 8, 15, 22, 29];
assert.deepEqual(runDaysInMonth("0 9 * * 1-7", 2026, 11), Array.from({ length: 30 }, (_, i) => i + 1));
assert.deepEqual(runDaysInMonth("0 9 * * 5-7", 2026, 11), [1, 6, 7, 8, 13, 14, 15, 20, 21, 22, 27, 28, 29]);
assert.deepEqual(runDaysInMonth("0 9 * * 7-7", 2026, 11), sundays);
assert.deepEqual(runDaysInMonth("0 0 * * 7", 2026, 11), sundays);
assert.deepEqual(runDaysInMonth("0 9 * * 5,7", 2026, 11), [1, 6, 8, 13, 15, 20, 22, 27, 29]);
assert.equal(iso(nextRun("0 9 * * 6-7", at("2026-11-01T00:00:00Z"))), "2026-11-01T02:00:00.000Z");
// invariant: nextRun/runDaysInMonth are null exactly when describeCron falls back
for (const [e] of cases) {
  const fb = describeCron(e) === F;
  assert.equal(nextRun(e, at("2026-10-29T00:00:00Z")) === null, fb, `nextRun null <=> fallback: ${e}`);
  assert.equal(runDaysInMonth(e, 2026, 11) === null, fb, `runDays null <=> fallback: ${e}`);
}
console.log("cron nextRun/runDays: passed");
