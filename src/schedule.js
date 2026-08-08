const WEEKDAYS = ['日曜', '月曜', '火曜', '水曜', '木曜', '金曜', '土曜'];

export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isScheduledToday(service, date = new Date()) {
  if (!service.enabled) return false;

  switch (service.frequency) {
    case 'daily':
      return true;
    case 'weekly':
      return date.getDay() === service.weekday;
    case 'monthly':
      return date.getDate() === service.day;
    case 'once':
      return true;
    default:
      return false;
  }
}

export function isDue(service, date = new Date(), history = {}) {
  if (!isScheduledToday(service, date)) return false;
  const completed = history[service.id];
  if (service.frequency === 'once') return !completed;
  return completed !== localDateKey(date);
}

export function frequencyLabel(service) {
  switch (service.frequency) {
    case 'daily':
      return '毎日';
    case 'weekly':
      return `毎週 ${WEEKDAYS[service.weekday]}`;
    case 'monthly':
      return `毎月${service.day}日`;
    case 'once':
      return '1回だけ';
    default:
      return service.frequency;
  }
}
