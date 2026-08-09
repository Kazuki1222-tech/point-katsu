import test from 'node:test';
import assert from 'node:assert/strict';
import { buildShortcutRunUrl } from '../src/shortcut.js';

test('buildShortcutRunUrl encodes shortcut name and newline-delimited URLs', () => {
  const url = buildShortcutRunUrl({
    name: 'ポイ活巡回',
    urls: ['https://www.yahoo.co.jp/', 'https://news.yahoo.co.jp/'],
    callbackUrl: 'https://example.com/point-katsu/?shortcut=done'
  });
  const parsed = new URL(url);
  assert.equal(parsed.protocol, 'shortcuts:');
  assert.equal(parsed.hostname, 'x-callback-url');
  assert.equal(parsed.pathname, '/run-shortcut');
  assert.equal(parsed.searchParams.get('name'), 'ポイ活巡回');
  assert.equal(parsed.searchParams.get('input'), 'text');
  assert.equal(parsed.searchParams.get('text'), 'https://www.yahoo.co.jp/\nhttps://news.yahoo.co.jp/');
  assert.equal(parsed.searchParams.get('x-success'), 'https://example.com/point-katsu/?shortcut=done');
});

test('buildShortcutRunUrl rejects an empty URL list', () => {
  assert.throws(() => buildShortcutRunUrl({
    name: 'ポイ活巡回', urls: [], callbackUrl: 'https://example.com/'
  }), /at least one URL/i);
});
