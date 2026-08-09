// Y!mobileのパケットマイレージ対象サービスは変更されることがあります。
// 公式一覧: https://www.ymobile.jp/service/ymobile/packetmileage/
export const services = [
  { id: 'yahoo-top', name: 'Yahoo! JAPAN', url: 'https://www.yahoo.co.jp/', earnsMiles: true, frequency: 'daily', enabled: true },
  { id: 'yahoo-shopping', name: 'Yahoo!ショッピング', url: 'https://shopping.yahoo.co.jp/', earnsMiles: true, frequency: 'daily', enabled: true },
  { id: 'ebookjapan', name: 'ebookjapan', url: 'https://ebookjapan.yahoo.co.jp/', earnsMiles: true, frequency: 'daily', enabled: true },
  { id: 'yahoo-fleamarket', name: 'Yahoo!フリマ', url: 'https://paypayfleamarket.yahoo.co.jp/', earnsMiles: true, frequency: 'daily', enabled: true },
  { id: 'yahoo-news', name: 'Yahoo!ニュース', url: 'https://news.yahoo.co.jp/', earnsMiles: true, frequency: 'daily', enabled: true },
  { id: 'sportsnavi', name: 'スポーツナビ', url: 'https://sports.yahoo.co.jp/', earnsMiles: true, frequency: 'daily', enabled: true },
  { id: 'yahoo-auctions', name: 'Yahoo!オークション', url: 'https://auctions.yahoo.co.jp/', earnsMiles: true, frequency: 'daily', enabled: true },
  { id: 'yahoo-weather', name: 'Yahoo!天気・災害', url: 'https://weather.yahoo.co.jp/', earnsMiles: true, frequency: 'daily', enabled: true },
  { id: 'paypay-gourmet', name: 'PayPayグルメ', url: 'https://paypaygourmet.yahoo.co.jp/', earnsMiles: true, frequency: 'daily', enabled: true },
  { id: 'yahoo-transit', name: 'Yahoo!路線情報', url: 'https://transit.yahoo.co.jp/', earnsMiles: true, frequency: 'daily', enabled: true },
  { id: 'chiebukuro', name: 'Yahoo!知恵袋', url: 'https://chiebukuro.yahoo.co.jp/', earnsMiles: true, frequency: 'daily', enabled: true },
  { id: 'yahoo-travel', name: 'Yahoo!トラベル', url: 'https://travel.yahoo.co.jp/', earnsMiles: true, frequency: 'daily', enabled: true },
  { id: 'yahoo-finance', name: 'Yahoo!ファイナンス', url: 'https://finance.yahoo.co.jp/', earnsMiles: true, frequency: 'daily', enabled: true },
  { id: 'otoku-takarabako', name: 'Yahoo!おトク宝箱', url: 'https://takarabako.yahoo.co.jp/', earnsMiles: true, frequency: 'daily', enabled: true },
  { id: 'ymobile-menu', name: 'Y!mobile メニュー', url: 'https://ymobile.yahoo.co.jp/packet/noauth', earnsMiles: false, frequency: 'weekly', weekday: 0, enabled: true },
  { id: 'zubatoku', name: 'Yahoo!ズバトク', url: 'https://toku.yahoo.co.jp/', earnsMiles: false, frequency: 'daily', enabled: false }
];
