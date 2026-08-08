import test from 'node:test';
import assert from 'node:assert/strict';
import { createHistoryStore } from '../src/storage.js';

function memoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem(key) { return data.has(key) ? data.get(key) : null; },
    setItem(key, value) { data.set(key, String(value)); },
    removeItem(key) { data.delete(key); }
  };
}

test('empty storage reads as empty history', () => {
  const store = createHistoryStore(memoryStorage(), 'test');
  assert.deepEqual(store.read(), {});
});

test('markDone stores the supplied local date key', () => {
  const store = createHistoryStore(memoryStorage(), 'test');
  store.markDone('yahoo-top', '2026-08-09');
  assert.deepEqual(store.read(), { 'yahoo-top': '2026-08-09' });
});

test('undo removes only the selected service record', () => {
  const storage = memoryStorage({ test: JSON.stringify({ a: '2026-08-09', b: '2026-08-09' }) });
  const store = createHistoryStore(storage, 'test');
  store.undo('a');
  assert.deepEqual(store.read(), { b: '2026-08-09' });
});

test('invalid stored JSON is treated as empty history', () => {
  const store = createHistoryStore(memoryStorage({ test: '{broken' }), 'test');
  assert.deepEqual(store.read(), {});
});
