import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('index exposes start balance, shortcut visit loop, ending balance and manual fallback', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const marker of [
    'id="current-mile-value"',
    'id="open-mileage-start"',
    'id="start-mile-input"',
    'id="record-start-button"',
    'id="run-shortcut-button"',
    'id="visit-progress"',
    'id="open-mileage-end"',
    'id="end-mile-input"',
    'id="record-end-button"',
    'id="result-diff"',
    'id="manual-list"',
    'id="shortcut-setup"'
  ]) {
    assert.ok(html.includes(marker), `missing ${marker}`);
  }
});

test('UI wording distinguishes page visits from confirmed mile awards', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const js = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  assert.ok(html.includes('見込 +14'));
  assert.ok(html.includes('実際の付与はY!mobileの残高で確認'));
  assert.ok(js.includes("badge.textContent = '訪問済'"));
  assert.equal(js.includes("badge.textContent = '済'"), false);
});

test('app launches the named Shortcut with x-callback and handles return completion', async () => {
  const js = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  assert.ok(js.includes('buildShortcutRunUrl'));
  assert.ok(js.includes("SHORTCUT_NAME = 'ポイ活巡回'"));
  assert.ok(js.includes("params.get('shortcut') === 'done'"));
  assert.ok(js.includes('sessionStore.markVisited'));
});

test('shortcut setup guide can open the Shortcuts editor', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.ok(html.includes('shortcuts://create-shortcut'));
  assert.ok(html.includes('改行'));
  assert.ok(html.includes('3秒'));
});

test('mobile stylesheet keeps primary actions thumb-friendly', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  assert.ok(css.includes('.primary-button'));
  assert.ok(css.includes('min-height: 56px'));
  assert.ok(css.includes('.step-card'));
});
