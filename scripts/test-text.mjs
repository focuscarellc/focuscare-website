import assert from 'node:assert/strict';
import {plainText,descriptionFor,assertCleanText,calendarDate} from '../design/motion-led/src/text.mjs';
assert.equal(plainText('**TL;DR:** Review [training records](/training) and `renewal dates`.'),'Review training records and renewal dates.');
const source='Keep recruitment records together. Staff can review missing documents, due dates and the next action without searching separate folders.';
assert.equal(descriptionFor(source,65),'Keep recruitment records together.');
const excerpt=descriptionFor('Organize paperwork across the provider team with clearly assigned owners and dates for every recorded follow-up.',75);
assert.ok(excerpt.length<=75&&excerpt.endsWith('...'));
assert.ok('Organize paperwork across the provider team with clearly assigned owners and dates for every recorded follow-up.'.startsWith(excerpt.slice(0,-3)));
assert.doesNotThrow(()=>assertCleanText('© Focus Care · Your team’s records','valid text'));
assert.throws(()=>assertCleanText('\u00c2\u00a9 Focus Care','damaged footer'),/encoding corruption/);
assert.throws(()=>assertCleanText('team\u00e2\u20ac\u2122s records','damaged apostrophe'),/encoding corruption/);
assert.throws(()=>assertCleanText('\ufffd','replacement character'),/encoding corruption/);
for (const tz of ['Asia/Dubai', 'UTC', 'America/Los_Angeles']) {
  process.env.TZ = tz;
  assert.equal(calendarDate('January 31, 2026'), '2026-01-31');
  assert.equal(calendarDate('February 12, 2026'), '2026-02-12');
}
assert.equal(calendarDate('February 29, 2024'), '2024-02-29');
assert.throws(()=>calendarDate('February 29, 2026'), /Invalid publication date/);
assert.throws(()=>calendarDate('Not a date'), /Invalid publication date/);
console.log('Metadata, calendar dates and encoding regressions passed.');
