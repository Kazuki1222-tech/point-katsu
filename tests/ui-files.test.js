import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('index exposes today, remaining count, next action and other section', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const marker of ['id="remaining-count"', 'id="next-button"', 'id="today-list"', 'id="other-list"']) {
    assert.ok(html.includes(marker), `missing ${marker}`);
  }
});

test('app only opens destinations in direct response to a user action', async () => {
  const js = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  assert.ok(js.includes("window.open(service.url"));
  assert.ok(js.includes("nextButton.addEventListener('click'"));
  assert.ok(js.includes('store.markDone'));
});

test('mobile stylesheet provides a sticky thumb-friendly next button', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  assert.ok(css.includes('.next-action'));
  assert.ok(css.includes('position: sticky'));
  assert.ok(css.includes('min-height: 52px'));
});
