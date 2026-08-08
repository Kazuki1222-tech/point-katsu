export function createHistoryStore(storage, key = 'point-katsu-history-v1') {
  function read() {
    try {
      const raw = storage.getItem(key);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }

  function write(history) {
    storage.setItem(key, JSON.stringify(history));
  }

  return {
    read,
    markDone(serviceId, dateKey) {
      const history = read();
      history[serviceId] = dateKey;
      write(history);
    },
    undo(serviceId) {
      const history = read();
      delete history[serviceId];
      write(history);
    }
  };
}
