import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

test('home-screen web app stays in browser mode and has app icons', async () => {
  const raw = await readFile(new URL('../manifest.webmanifest', import.meta.url), 'utf8');
  const manifest = JSON.parse(raw);
  assert.equal(manifest.display, 'browser');
  assert.equal(manifest.start_url, './');
  assert.ok(manifest.icons.some((icon) => icon.sizes === '192x192'));
  assert.ok(manifest.icons.some((icon) => icon.sizes === '512x512'));
});

test('service worker only pre-caches local app shell assets', async () => {
  const sw = await readFile(new URL('../sw.js', import.meta.url), 'utf8');
  assert.ok(sw.includes("'./index.html'"));
  assert.ok(sw.includes("'./src/app.js'"));
  assert.ok(sw.includes("'./src/shortcut.js'"));
  assert.ok(sw.includes("'./src/session.js'"));
  assert.ok(sw.includes("point-katsu-v2"));
  assert.equal(sw.includes('yahoo.co.jp'), false);
});

test('required icon files exist', async () => {
  await access(new URL('../assets/icon-192.png', import.meta.url));
  await access(new URL('../assets/icon-512.png', import.meta.url));
  await access(new URL('../assets/apple-touch-icon.png', import.meta.url));
});
