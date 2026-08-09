function normalizeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function createMileageSessionStore(storage, key = 'point-katsu-mile-sessions-v1') {
  function readAll() {
    try {
      const raw = storage.getItem(key);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }

  function writeAll(all) {
    storage.setItem(key, JSON.stringify(all));
  }

  function updateDay(dateKey, patch) {
    const all = readAll();
    all[dateKey] = { ...(all[dateKey] || {}), ...patch };
    writeAll(all);
    return all[dateKey];
  }

  return {
    readDay(dateKey) {
      return readAll()[dateKey] || {};
    },
    recordStart(dateKey, miles) {
      const value = normalizeNumber(miles);
      if (value === null) throw new Error('miles must be a finite number');
      return updateDay(dateKey, { startMiles: value });
    },
    markVisited(dateKey, count, visitedAt = new Date().toISOString()) {
      return updateDay(dateKey, { visitedCount: Number(count) || 0, visitedAt });
    },
    recordEnd(dateKey, miles) {
      const value = normalizeNumber(miles);
      if (value === null) throw new Error('miles must be a finite number');
      return updateDay(dateKey, { endMiles: value });
    },
    latestKnownMiles() {
      const all = readAll();
      const keys = Object.keys(all).sort().reverse();
      for (const dateKey of keys) {
        const session = all[dateKey];
        const value = normalizeNumber(session?.endMiles ?? session?.startMiles);
        if (value !== null) return value;
      }
      return null;
    }
  };
}

export function mileDiff(session) {
  const start = normalizeNumber(session?.startMiles);
  const end = normalizeNumber(session?.endMiles);
  if (start === null || end === null) return null;
  return end - start;
}

export function verificationState(session, expectedMiles) {
  const diff = mileDiff(session);
  if (diff === null) return 'unverified';
  if (diff >= expectedMiles) return 'confirmed';
  if (diff > 0) return 'partial';
  return 'pending';
}
