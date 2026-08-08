import test from 'node:test';
import assert from 'node:assert/strict';
import { services } from '../src/services.js';

test('service ids are unique and enabled services use https URLs', () => {
  const ids = services.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const item of services.filter((item) => item.enabled)) {
    assert.match(item.url, /^https:\/\//);
    assert.ok(['daily', 'weekly', 'monthly', 'once'].includes(item.frequency));
  }
});

test('default list contains Y!mobile packet mileage core destinations', () => {
  const names = services.map((item) => item.name);
  for (const name of ['Yahoo! JAPAN', 'Yahoo!ショッピング', 'Yahoo!ニュース', 'Yahoo!おトク宝箱', 'Y!mobile メニュー']) {
    assert.ok(names.includes(name), `missing ${name}`);
  }
});
