import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('Pages workflow deploys static repository on main push', async () => {
  const workflow = await readFile(new URL('../.github/workflows/pages.yml', import.meta.url), 'utf8');
  for (const marker of ['actions/checkout@v6', 'actions/configure-pages@v5', 'actions/upload-pages-artifact@v4', 'actions/deploy-pages@v4', 'pages: write', 'id-token: write']) {
    assert.ok(workflow.includes(marker), `missing ${marker}`);
  }
});

test('README explains iPhone install and service configuration', async () => {
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  for (const marker of ['ホーム画面に追加', 'src/services.js', 'localStorage', 'GitHub Pages']) {
    assert.ok(readme.includes(marker), `missing ${marker}`);
  }
});
