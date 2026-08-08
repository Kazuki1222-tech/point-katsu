# ポイ活ランチャー PWA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** iPhoneのホーム画面から起動し、Y!mobileパケットマイレージ対象サービス等を「今日の残り」順に1タップずつ開いて実施済み管理できる静的PWAを作る。

**Architecture:** GitHub Pagesで配信可能な依存ライブラリなしのHTML/CSS/ES Modules構成。頻度判定と状態管理を純粋関数に分離し、UIは設定データを描画する。端末ごとの完了履歴はlocalStorageだけに保存し、外部サービスの認証や操作は自動化しない。

**Tech Stack:** HTML5, CSS, JavaScript ES Modules, Web App Manifest, Service Worker, Node.js built-in test runner, Git/GitHub Pages

## Global Constraints

- GitHub Pagesで配信できる静的ファイルのみ。
- 認証情報、Cookie、個人情報を保存しない。
- 外部サービスの自動ログイン・自動クリックを行わない。
- 状態は端末ローカルのlocalStorageに保存し、端末間同期しない。
- 頻度は `daily`, `weekly`, `monthly`, `once` をサポートする。
- iPhoneのホーム画面追加を主利用形態とする。

---

## File Structure

- `index.html`: PWAシェルと主要UI領域。
- `styles.css`: iPhone向けレスポンシブUI。
- `src/services.js`: 初期サービス一覧。サービス追加・URL変更の主編集箇所。
- `src/schedule.js`: 日次/週次/月次/一度だけの対象判定と日付処理。
- `src/storage.js`: localStorage完了履歴の読み書き。
- `src/app.js`: 描画、開く、完了/解除、残件数更新。
- `manifest.webmanifest`: ホーム画面追加用メタデータ。
- `sw.js`: アプリ本体のみをキャッシュするservice worker。
- `assets/icon.svg`: PWAアイコン元データ。
- `tests/schedule.test.js`: 頻度判定テスト。
- `tests/storage.test.js`: ストレージアダプタテスト。
- `tests/config.test.js`: サービス設定の一意性・URL・頻度テスト。
- `package.json`: Node標準テストの実行定義。
- `README.md`: GitHub Pages公開方法とサービス追加方法。

### Task 1: 頻度判定と設定モデル

**Files:**
- Create: `package.json`
- Create: `src/schedule.js`
- Create: `src/services.js`
- Create: `tests/schedule.test.js`
- Create: `tests/config.test.js`

**Interfaces:**
- Produces: `localDateKey(date): string`
- Produces: `isDue(service, date, history): boolean`
- Produces: `frequencyLabel(service): string`
- Produces: `services: Service[]`

- [ ] **Step 1:** `daily`, `weekly`, `monthly`, `once` の期待挙動を `node:test` で先に記述する。
- [ ] **Step 2:** `npm test` を実行し、実装未存在による失敗を確認する。
- [ ] **Step 3:** `src/schedule.js` に最小実装を追加する。
- [ ] **Step 4:** Y!mobile公式の現行対象サービスを中心に `src/services.js` を作り、設定検証テストを書く。
- [ ] **Step 5:** `npm test` が通ることを確認しコミットする。

### Task 2: 端末内完了履歴

**Files:**
- Create: `src/storage.js`
- Create: `tests/storage.test.js`

**Interfaces:**
- Produces: `createHistoryStore(storage, key)` returning `{ read, markDone, undo }`

- [ ] **Step 1:** 空状態、完了記録、解除、壊れたJSON復旧のテストを書く。
- [ ] **Step 2:** テスト失敗を確認する。
- [ ] **Step 3:** localStorage互換オブジェクトを受け取るストレージ実装を追加する。
- [ ] **Step 4:** 全テスト通過を確認しコミットする。

### Task 3: iPhone向けランチャーUI

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `src/app.js`

**Interfaces:**
- Consumes: `services`, `isDue`, `frequencyLabel`, `createHistoryStore`

- [ ] **Step 1:** 「残りN件」「次を開く」「今日やること」「今日は対象外」のDOM骨格を作る。
- [ ] **Step 2:** `app.js` で対象サービスを算出し、未完了→完了の順に描画する。
- [ ] **Step 3:** 「開く」で履歴に完了を記録して外部URLを新規ブラウザコンテキストで開く。自動クリックはしない。
- [ ] **Step 4:** 「次を開く」で最初の未完了項目だけを開き、戻った後に同じ位置から続けられるようにする。
- [ ] **Step 5:** 完了解除と対象外折りたたみを追加する。
- [ ] **Step 6:** 小画面で親指操作しやすいCSSを実装する。
- [ ] **Step 7:** `npm test` と静的ファイルの構文確認を実行しコミットする。

### Task 4: PWA化とオフライン起動

**Files:**
- Create: `manifest.webmanifest`
- Create: `sw.js`
- Create: `assets/icon.svg`
- Modify: `index.html`
- Modify: `src/app.js`

- [ ] **Step 1:** manifestとアイコンを追加する。
- [ ] **Step 2:** service workerでアプリ本体だけをキャッシュし、外部ポイ活ページはキャッシュ対象外にする。
- [ ] **Step 3:** HTTPS/GitHub Pages上だけでservice worker登録する処理を追加する。
- [ ] **Step 4:** manifest JSONとキャッシュ対象ファイルの存在をテスト/検証する。
- [ ] **Step 5:** 全テスト通過を確認しコミットする。

### Task 5: README・GitHub Pages公開準備

**Files:**
- Create: `README.md`
- Create: `.github/workflows/pages.yml`

- [ ] **Step 1:** iPhoneの「ホーム画面に追加」手順、夫婦で状態が別になる仕様、サービス追加方法をREADMEに記載する。
- [ ] **Step 2:** GitHub Pages用Actions workflowを追加する。
- [ ] **Step 3:** `npm test`、`git diff --check`、ローカルHTTP配信で主要ファイルが200になることを確認する。
- [ ] **Step 4:** 最終コミットを作成する。
