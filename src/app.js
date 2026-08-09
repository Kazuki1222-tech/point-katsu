import { services } from './services.js';
import { localDateKey } from './schedule.js';
import { createHistoryStore } from './storage.js';
import { buildShortcutRunUrl } from './shortcut.js';
import { createMileageSessionStore, mileDiff, verificationState } from './session.js';

const SHORTCUT_NAME = 'ポイ活巡回';
const today = new Date();
const dateKey = localDateKey(today);
const historyStore = createHistoryStore(window.localStorage);
const sessionStore = createMileageSessionStore(window.localStorage);
const earningServices = services.filter((service) => service.enabled && service.earnsMiles);
const balanceService = services.find((service) => service.id === 'ymobile-menu');
const expectedMiles = earningServices.length;

const elements = {
  todayDate: document.querySelector('#today-date'),
  currentMiles: document.querySelector('#current-mile-value'),
  currentCaption: document.querySelector('#current-mile-caption'),
  openStart: document.querySelector('#open-mileage-start'),
  startInput: document.querySelector('#start-mile-input'),
  recordStart: document.querySelector('#record-start-button'),
  startNote: document.querySelector('#start-note'),
  runShortcut: document.querySelector('#run-shortcut-button'),
  shortcutStatus: document.querySelector('#shortcut-status'),
  visitProgress: document.querySelector('#visit-progress'),
  manualList: document.querySelector('#manual-list'),
  openEnd: document.querySelector('#open-mileage-end'),
  endInput: document.querySelector('#end-mile-input'),
  recordEnd: document.querySelector('#record-end-button'),
  resultPanel: document.querySelector('#result-panel'),
  resultDiff: document.querySelector('#result-diff'),
  resultNote: document.querySelector('#result-note')
};

elements.todayDate.textContent = new Intl.DateTimeFormat('ja-JP', {
  month: 'long', day: 'numeric', weekday: 'short'
}).format(today);

function visitedToday(service, history) {
  return history[service.id] === dateKey;
}

function visitedCount(history = historyStore.read()) {
  return earningServices.filter((service) => visitedToday(service, history)).length;
}

function markAllShortcutVisits() {
  for (const service of earningServices) {
    historyStore.markDone(service.id, dateKey);
  }
  sessionStore.markVisited(dateKey, expectedMiles);
}

function handleShortcutCallback() {
  const url = new URL(window.location.href);
  const params = url.searchParams;
  if (params.get('shortcut') === 'done') {
    markAllShortcutVisits();
    params.delete('shortcut');
    window.history.replaceState({}, '', `${url.pathname}${params.toString() ? `?${params}` : ''}${url.hash}`);
    elements.shortcutStatus.textContent = `${expectedMiles}件の巡回完了。最後にY!mobileの実マイルを確認してください。`;
  }
}

function openBalancePage() {
  if (!balanceService) return;
  window.open(balanceService.url, '_blank', 'noopener,noreferrer');
}

function openManualService(service) {
  historyStore.markDone(service.id, dateKey);
  const count = visitedCount();
  sessionStore.markVisited(dateKey, count);
  render();
  window.open(service.url, '_blank', 'noopener,noreferrer');
}

function undoManualService(service) {
  historyStore.undo(service.id);
  sessionStore.markVisited(dateKey, visitedCount());
  render();
}

function makeServiceCard(service, history) {
  const done = visitedToday(service, history);
  const card = document.createElement('article');
  card.className = `service-card${done ? ' done' : ''}`;

  const copy = document.createElement('div');
  const name = document.createElement('p');
  name.className = 'service-name';
  name.textContent = service.name;
  const meta = document.createElement('p');
  meta.className = 'service-meta';
  meta.textContent = '1日1マイル対象';
  copy.append(name, meta);

  const actions = document.createElement('div');
  actions.className = 'service-actions';

  if (done) {
    const badge = document.createElement('span');
    badge.className = 'done-badge';
    badge.textContent = '訪問済';
    const undo = document.createElement('button');
    undo.type = 'button';
    undo.className = 'undo-button';
    undo.textContent = '戻す';
    undo.addEventListener('click', () => undoManualService(service));
    actions.append(badge, undo);
  } else {
    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'open-button';
    open.textContent = '開く';
    open.addEventListener('click', () => openManualService(service));
    actions.append(open);
  }

  card.append(copy, actions);
  return card;
}

function renderManualList(history) {
  elements.manualList.replaceChildren();
  for (const service of earningServices) {
    elements.manualList.append(makeServiceCard(service, history));
  }
}

function renderBalance(session) {
  const latestKnown = sessionStore.latestKnownMiles();
  const current = session.endMiles ?? session.startMiles ?? latestKnown;
  elements.currentMiles.textContent = current ?? '—';

  if (session.endMiles != null) {
    elements.currentCaption.textContent = '今日の終了確認';
  } else if (session.startMiles != null) {
    elements.currentCaption.textContent = '今日の開始確認';
  } else if (latestKnown != null) {
    elements.currentCaption.textContent = '前回の確認値';
  } else {
    elements.currentCaption.textContent = '現在マイル';
  }

  if (session.startMiles != null && elements.startInput.value === '') {
    elements.startInput.value = String(session.startMiles);
  } else if (session.startMiles == null && latestKnown != null && elements.startInput.value === '') {
    elements.startInput.placeholder = `前回 ${latestKnown}`;
  }
  if (session.endMiles != null && elements.endInput.value === '') {
    elements.endInput.value = String(session.endMiles);
  }
}

function renderResult(session) {
  const diff = mileDiff(session);
  const state = verificationState(session, expectedMiles);
  elements.resultPanel.className = `result-panel ${state}`;

  if (diff === null) {
    elements.resultDiff.textContent = 'まだ未確認';
    elements.resultNote.textContent = '巡回後にY!mobileの現在マイルを再確認して、終了値を記録します。';
    return;
  }

  const signed = diff > 0 ? `+${diff}` : String(diff);
  elements.resultDiff.textContent = `マイル差分 ${signed}`;

  if (state === 'confirmed') {
    elements.resultNote.textContent = diff === expectedMiles
      ? `見込 +${expectedMiles} mile と同じ差分を確認しました。`
      : `見込 +${expectedMiles} mile 以上の差分です。ほかの獲得分を含む可能性があります。`;
  } else if (state === 'partial') {
    elements.resultNote.textContent = `一部の差分を確認。残りは反映待ちの可能性があるため、後で再確認してください。`;
  } else if (diff < 0) {
    elements.resultNote.textContent = '開始時より小さい値です。入力値または月替わり等を確認してください。';
  } else {
    elements.resultNote.textContent = `差分はまだ0です。訪問は完了していますが、反映待ちの可能性があります。`;
  }
}

function render() {
  const history = historyStore.read();
  const session = sessionStore.readDay(dateKey);
  const count = visitedCount(history);

  elements.visitProgress.textContent = `${count} / ${expectedMiles}`;
  elements.runShortcut.disabled = session.startMiles == null;
  elements.runShortcut.textContent = count === expectedMiles ? '14件をもう一度巡回' : '14件をショートカットで巡回';
  if (session.startMiles == null) {
    elements.shortcutStatus.textContent = '先に開始マイルを記録すると巡回できます。';
  } else if (count === expectedMiles && !elements.shortcutStatus.textContent.includes('巡回完了')) {
    elements.shortcutStatus.textContent = '14件すべて訪問済。最後に実マイルを確認してください。';
  }

  renderBalance(session);
  renderManualList(history);
  renderResult(session);
}

function recordMiles(input, kind) {
  if (input.value.trim() === '') return;
  const value = Number(input.value);
  if (!Number.isFinite(value) || value < 0) return;
  if (kind === 'start') {
    sessionStore.recordStart(dateKey, value);
    elements.startNote.textContent = `開始 ${value} mile を記録しました。`;
  } else {
    sessionStore.recordEnd(dateKey, value);
  }
  render();
}

function runShortcut() {
  const callback = new URL(window.location.href);
  callback.search = '';
  callback.hash = '';
  callback.searchParams.set('shortcut', 'done');
  const runUrl = buildShortcutRunUrl({
    name: SHORTCUT_NAME,
    urls: earningServices.map((service) => service.url),
    callbackUrl: callback.toString()
  });
  window.location.href = runUrl;
}

elements.openStart.addEventListener('click', openBalancePage);
elements.openEnd.addEventListener('click', openBalancePage);
elements.recordStart.addEventListener('click', () => recordMiles(elements.startInput, 'start'));
elements.recordEnd.addEventListener('click', () => recordMiles(elements.endInput, 'end'));
elements.runShortcut.addEventListener('click', runShortcut);

handleShortcutCallback();
render();

if ('serviceWorker' in navigator && window.isSecureContext) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
