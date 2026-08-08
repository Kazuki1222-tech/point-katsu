# ポイ活ランチャー

Y!mobileパケットマイレージ等の「毎日いくつもページを開く」を、iPhoneのホーム画面から順番に処理するための小さなPWAです。

## 使い方

1. GitHub Pagesで公開したURLをiPhoneのSafariで開く。
2. Safariの共有ボタンから「ホーム画面に追加」を選ぶ。
3. 「ポイ活」アイコンを開く。
4. 上部の「次を開く」を押す。対象サービスを開いた時点で、その端末では「済」として記録される。
5. ポイ活ランチャーへ戻り、同じ「次を開く」を繰り返す。
6. 誤って済にした項目は「戻す」で解除できる。

完了履歴は `localStorage` に保存されます。そのため夫婦で同じURLを使っても、それぞれのiPhoneで完了状態は独立します。

## 初期サービス

`src/services.js` にY!mobileのパケットマイレージ対象サービスを初期登録しています。Y!mobileの対象サービスや条件は変更される場合があるため、公式ページを基準に必要に応じて更新してください。

サービス例:

```js
{
  id: 'yahoo-news',
  name: 'Yahoo!ニュース',
  url: 'https://news.yahoo.co.jp/',
  frequency: 'daily',
  enabled: true
}
```

頻度は次の4種類です。

- `daily`: 毎日
- `weekly`: 毎週。`weekday: 0`（日曜）〜 `6`（土曜）を追加
- `monthly`: 毎月。`day: 1`〜`31`を追加
- `once`: 一度完了するまで

`enabled: false` にすると一覧から外れます。初期状態ではYahoo!ズバトクを無効にしています。

## GitHub Pages

このリポジトリには `.github/workflows/pages.yml` を含めています。リポジトリのSettings → PagesでSourceを **GitHub Actions** に設定すると、`main` へのpush時に静的サイトを公開できます。

公開サイトには認証情報を置きません。ログイン、くじ、チェックイン等は各サービス側で手動実行します。このアプリが行うのは対象ページを開くところまでです。

## ローカル確認

```bash
npm test
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000/` を開きます。Service Workerは安全なコンテキストでのみ登録されます。
