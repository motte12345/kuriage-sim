# PLAN.md - 実装計画

## Phase 1: プロジェクト基盤 + 計算エンジン
- React + TypeScript + Vite プロジェクト初期化
- React Router でページルーティング
- 計算ロジック（純粋関数、UIから独立）
  - 元利均等返済スケジュール生成
  - 元金均等返済スケジュール生成
  - 繰上返済（期間短縮型・返済額軽減型）
  - 複数回繰上返済
  - 借り換え損益計算
- 計算ロジックのユニットテスト（Vitest）

## Phase 2: UI実装（メインツール）
- 共通レイアウト（ヘッダー、フッター、ナビ）
- トップページ（ツール一覧）
- 繰上返済シミュレーター（/kuriage）
  - 入力フォーム
  - 結果表示（削減額、比較表）
  - 返済スケジュール表（折りたたみ）
  - グラフ（Recharts：残高推移、元金・利息積み上げ棒）

## Phase 3: 残りのツール
- 複数回繰上返済（/kuriage-multi）
- 借り換えシミュレーター（/karikae）
- ローン比較ツール（/hikaku）
- 概要・免責ページ（/about）

## Phase 4: SEO・収益化・デプロイ
- メタタグ・OGP・構造化データ
- AdSense導入
- Google Analytics + Search Console
- Cloudflare Pages デプロイ設定
- 補足コンテンツ（SEO用記事）

## 現在のフェーズ: Phase 1
