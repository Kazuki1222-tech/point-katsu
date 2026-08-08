import test from 'node:test';
import assert from 'node:assert/strict';
import { localDateKey, isDue, frequencyLabel } from '../src/schedule.js';

const sunday = new Date(2026, 7, 9, 8, 0, 0); // 2026-08-09 local time

function service(overrides = {}) {
  return { id: 'x', name: 'X', url: 'https://example.com', frequency: 'daily', enabled: true, ...overrides };
}

test('localDateKey uses local calendar date', () => {
  assert.equal(localDateKey(sunday), '2026-08-09');
});

test('daily service is due if not completed today', () => {
  assert.equal(isDue(service(), sunday, {}), true);
  assert.equal(isDue(service(), sunday, { x: '2026-08-09' }), false);
});

test('weekly service is due only on configured weekday and if not completed today', () => {
  const weekly = service({ frequency: 'weekly', weekday: 0 });
  assert.equal(isDue(weekly, sunday, {}), true);
  assert.equal(isDue(weekly, new Date(2026, 7, 10), {}), false);
});

test('monthly service is due only on configured day of month', () => {
  const monthly = service({ frequency: 'monthly', day: 9 });
  assert.equal(isDue(monthly, sunday, {}), true);
  assert.equal(isDue(monthly, new Date(2026, 7, 10), {}), false);
});

test('once service is due until it has any completion record', () => {
  const once = service({ frequency: 'once' });
  assert.equal(isDue(once, sunday, {}), true);
  assert.equal(isDue(once, sunday, { x: '2026-07-01' }), false);
});

test('disabled service is never due', () => {
  assert.equal(isDue(service({ enabled: false }), sunday, {}), false);
});

test('frequencyLabel returns concise Japanese labels', () => {
  assert.equal(frequencyLabel(service()), '毎日');
  assert.equal(frequencyLabel(service({ frequency: 'weekly', weekday: 0 })), '毎週 日曜');
  assert.equal(frequencyLabel(service({ frequency: 'monthly', day: 9 })), '毎月9日');
  assert.equal(frequencyLabel(service({ frequency: 'once' })), '1回だけ');
});
