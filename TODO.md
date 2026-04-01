# TODO.md

## Phase 1: プロジェクト基盤 + 計算エンジン
- [x] React + TypeScript + Vite プロジェクト初期化
- [x] React Router 導入
- [x] 計算ロジック実装（元利均等・元金均等）
- [x] 繰上返済ロジック（期間短縮型・返済額軽減型）
- [x] 複数回繰上返済ロジック
- [x] 借り換え損益計算ロジック
- [x] 計算ロジックのユニットテスト（28テスト全通過）

## Phase 2: UI実装（メインツール）
- [x] 共通レイアウト（ヘッダー、フッター、ナビ）
- [x] トップページ
- [x] 繰上返済シミュレーター UI
- [x] グラフ（Recharts: 残高推移折れ線、元金・利息積み上げ棒）

## Phase 3: 残りのツール
- [x] 複数回繰上返済 UI
- [x] 借り換えシミュレーター UI
- [x] ローン比較ツール UI
- [x] 概要・免責ページ

## Phase 4: SEO・収益化・デプロイ
- [x] メタタグ・OGP（全6ページにSeoコンポーネント）
- [x] 構造化データ (JSON-LD WebApplication)
- [x] sitemap.xml / robots.txt
- [x] AdSense スクリプト導入（IDは要設定）
- [x] Google Analytics (GA4) スクリプト導入（測定IDは要設定）
- [x] Cloudflare Pages 対応（_redirects, _headers, コード分割）
- [ ] GitHub リポジトリ作成 + push
- [ ] Cloudflare Pages でプロジェクト接続
- [ ] GA4 測定ID・AdSense ID を実際の値に置換
- [ ] Search Console にサイト登録・サイトマップ送信
