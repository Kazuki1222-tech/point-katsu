import test from 'node:test';
import assert from 'node:assert/strict';
import { createMileageSessionStore, mileDiff, verificationState } from '../src/session.js';

function memoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem(key) { return data.has(key) ? data.get(key) : null; },
    setItem(key, value) { data.set(key, String(value)); },
    removeItem(key) { data.delete(key); }
  };
}

test('records start, shortcut visit completion, and end balance for one day', () => {
  const store = createMileageSessionStore(memoryStorage(), 'test');
  store.recordStart('2026-08-09', 126);
  store.markVisited('2026-08-09', 14, '2026-08-09T00:15:00.000Z');
  store.recordEnd('2026-08-09', 140);
  assert.deepEqual(store.readDay('2026-08-09'), {
    startMiles: 126,
    visitedCount: 14,
    visitedAt: '2026-08-09T00:15:00.000Z',
    endMiles: 140
  });
});

test('latestKnownMiles prefers the latest ending balance', () => {
  const store = createMileageSessionStore(memoryStorage(), 'test');
  store.recordEnd('2026-08-08', 120);
  store.recordStart('2026-08-09', 126);
  assert.equal(store.latestKnownMiles(), 126);
  store.recordEnd('2026-08-09', 140);
  assert.equal(store.latestKnownMiles(), 140);
});

test('mileDiff returns null until both balances exist', () => {
  assert.equal(mileDiff({ startMiles: 126 }), null);
  assert.equal(mileDiff({ startMiles: 126, endMiles: 140 }), 14);
});

test('verificationState distinguishes confirmed partial pending and unverified', () => {
  assert.equal(verificationState({}, 14), 'unverified');
  assert.equal(verificationState({ startMiles: 126, endMiles: 140 }, 14), 'confirmed');
  assert.equal(verificationState({ startMiles: 126, endMiles: 130 }, 14), 'partial');
  assert.equal(verificationState({ startMiles: 126, endMiles: 126 }, 14), 'pending');
});
