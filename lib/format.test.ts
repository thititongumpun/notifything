import assert from "node:assert/strict";
import {
  THAI_WEEKDAYS, bkkParts, daysUntil, fmtPassbookDate, fmtThaiDate, fmtThaiDateTime, fmtThaiMonthYear, relativeDayLabel,
} from "./format";

// Run: npx tsx lib/format.test.ts  (exits non-zero on any mismatch)
assert.equal(fmtThaiDate("2026-11-05T05:00:00Z"), "5 พ.ย. 2569");
assert.equal(fmtThaiDate(null), "—");
assert.equal(fmtThaiDateTime("2026-11-05T05:00:00Z"), "5 พ.ย. 2569 12:00");
assert.equal(fmtThaiMonthYear("2026-11-05T05:00:00Z"), "พฤศจิกายน 2569");
assert.equal(fmtPassbookDate("2026-11-05T05:00:00Z"), "05/11/69");
assert.deepEqual(bkkParts(new Date("2026-10-31T17:30:00Z")), { year: 2026, month: 11, day: 1, weekday: 0, hour: 0, minute: 30 });
assert.equal(daysUntil(new Date("2026-11-05T05:00:00Z"), new Date("2026-10-29T07:00:00Z")), 7);
assert.equal(daysUntil(new Date("2026-10-29T16:59:00Z"), new Date("2026-10-29T01:00:00Z")), 0);
assert.equal(daysUntil(new Date("2026-10-29T17:01:00Z"), new Date("2026-10-29T16:59:00Z")), 1);
assert.equal(daysUntil(new Date("2026-10-27T05:00:00Z"), new Date("2026-10-29T07:00:00Z")), -2);
assert.equal(relativeDayLabel(0), "วันนี้");
assert.equal(relativeDayLabel(1), "พรุ่งนี้");
assert.equal(relativeDayLabel(7), "อีก 7 วัน");
assert.equal(relativeDayLabel(-2), "เลยกำหนด 2 วัน");
assert.equal(THAI_WEEKDAYS[4], "พฤหัสบดี");
console.log("format: all passed");
