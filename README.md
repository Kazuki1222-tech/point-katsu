# Y!mobile マイル巡回

Y!mobileパケットマイレージ対象の14サービスを、iPhoneのSafari＋ショートカットで順番に巡回し、巡回前後の実マイル差分まで確認するPWAです。

## 毎日の使い方

1. iPhoneのSafariで公開URLを開き、共有 → **ホーム画面に追加**。アイコンからもSafariで開く設計です。
2. PWAの「Y!mobileで現在マイルを確認」から現在値を見て、**開始マイル**を入力。
3. 「14件をショートカットで巡回」を押す。
4. iPhoneショートカット `ポイ活巡回` が14URLをSafariで順番に開く。
5. 完了後、Shortcutsの **x-callback** でPWAへ戻る。
6. 「Y!mobileで現在マイルを再確認」から現在値を見て、**終了マイル**を入力。
7. PWAが開始値との差分を表示する。

> Safariで使う理由: iOSのstandaloneホーム画面Web AppはSafariとCookie・ストレージが分離されます。今回はYahoo!のログイン状態と、ショートカット完了後のx-callbackを同じSafari環境でつなぐため、manifestは `display: browser` にしています。

ページを開いたことは `訪問済` として管理します。ページ訪問だけで `マイル獲得済` とは判定しません。実際の付与はY!mobile側の残高で確認します。

## 初回だけ：iPhoneショートカットを作る

PWA内の「ショートカットを作成」からショートカットエディタを開き、名前を **ポイ活巡回** にします。

アクションは次の順です。

1. `ショートカットの入力` を受け取る。
2. `テキストを分割` で **改行** ごとに分割する。
3. `各項目を繰り返す`。
4. 繰り返し内で `URL` に `繰り返し項目` を入れる。
5. `URLを開く`。
6. `待機` を **3秒**。
7. 繰り返し終了。

対象URLはショートカットに固定しません。PWAが `shortcuts://x-callback-url/run-shortcut` で、その日の対象URLを改行区切りテキストとして渡します。対象サービスが変わった場合は `src/services.js` の更新だけで対応できます。

## データの扱い

- 完了履歴と入力したマイル値は `localStorage` に保存。
- 夫婦で同じURLを使っても、それぞれのiPhoneで状態は独立。
- Yahoo!/Y!mobileのID、パスワード、Cookie、トークンは保存しない。
- ログイン処理やページ内ボタンの自動クリックは行わない。

## サービス設定

`src/services.js` のうち `earnsMiles: true` の14件が一括巡回対象です。

```js
{
  id: 'yahoo-news',
  name: 'Yahoo!ニュース',
  url: 'https://news.yahoo.co.jp/',
  earnsMiles: true,
  frequency: 'daily',
  enabled: true
}
```

Y!mobileメニューは残高確認用なので `earnsMiles: false` です。

## GitHub Pages

`.github/workflows/pages.yml` で `main` へのpush時にGitHub Pagesへデプロイします。

## ローカル確認

```bash
npm test
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000/` を開きます。
