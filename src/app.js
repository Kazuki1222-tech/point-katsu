import { services } from './services.js';
import { frequencyLabel, isDue, isScheduledToday, localDateKey } from './schedule.js';
import { createHistoryStore } from './storage.js';

const store = createHistoryStore(window.localStorage);
const remainingCount = document.querySelector('#remaining-count');
const doneCount = document.querySelector('#done-count');
const todayDate = document.querySelector('#today-date');
const todayList = document.querySelector('#today-list');
const otherList = document.querySelector('#other-list');
const nextButton = document.querySelector('#next-button');
const nextName = document.querySelector('#next-name');

const today = new Date();
todayDate.textContent = new Intl.DateTimeFormat('ja-JP', {
  month: 'long', day: 'numeric', weekday: 'short'
}).format(today);

function completedForToday(service, history) {
  if (service.frequency === 'once') return Boolean(history[service.id]);
  return history[service.id] === localDateKey(today);
}

function shouldAppearToday(service, history) {
  if (!service.enabled) return false;
  if (service.frequency === 'once' && history[service.id]) return false;
  return isScheduledToday(service, today);
}

function openService(service) {
  store.markDone(service.id, localDateKey(today));
  render();
  window.open(service.url, '_blank', 'noopener,noreferrer');
}

function makeServiceCard(service, history, inToday) {
  const done = completedForToday(service, history);
  const card = document.createElement('article');
  card.className = `service-card${done ? ' done' : ''}`;

  const copy = document.createElement('div');
  const name = document.createElement('p');
  name.className = 'service-name';
  name.textContent = service.name;
  const meta = document.createElement('p');
  meta.className = 'service-meta';
  meta.textContent = frequencyLabel(service);
  copy.append(name, meta);

  const actions = document.createElement('div');
  actions.className = 'service-actions';

  if (inToday && done) {
    const badge = document.createElement('span');
    badge.className = 'done-badge';
    badge.textContent = '済';
    const undo = document.createElement('button');
    undo.type = 'button';
    undo.className = 'undo-button';
    undo.textContent = '戻す';
    undo.addEventListener('click', () => {
      store.undo(service.id);
      render();
    });
    actions.append(badge, undo);
  } else {
    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'open-button';
    open.textContent = '開く';
    open.addEventListener('click', () => openService(service));
    actions.append(open);
  }

  card.append(copy, actions);
  return card;
}

function renderList(container, items, history, inToday) {
  container.replaceChildren();
  if (items.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = inToday ? '今日は完了です' : '対象なし';
    container.append(empty);
    return;
  }
  for (const service of items) {
    container.append(makeServiceCard(service, history, inToday));
  }
}

function render() {
  const history = store.read();
  const enabled = services.filter((service) => service.enabled);
  const todays = enabled.filter((service) => shouldAppearToday(service, history));
  const others = enabled.filter((service) => !todays.includes(service));
  const remaining = todays.filter((service) => isDue(service, today, history));
  const completed = todays.length - remaining.length;

  remainingCount.textContent = String(remaining.length);
  doneCount.textContent = `${completed}/${todays.length} 完了`;
  nextButton.disabled = remaining.length === 0;
  nextButton.textContent = remaining.length === 0 ? '今日は完了' : '次を開く';
  nextName.textContent = remaining.length === 0 ? 'すべて済みです' : remaining[0].name;

  renderList(todayList, [...remaining, ...todays.filter((item) => !remaining.includes(item))], history, true);
  renderList(otherList, others, history, false);
}

nextButton.addEventListener('click', () => {
  const history = store.read();
  const service = services.find((item) => shouldAppearToday(item, history) && isDue(item, today, history));
  if (service) openService(service);
});

render();


if ('serviceWorker' in navigator && window.isSecureContext) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
