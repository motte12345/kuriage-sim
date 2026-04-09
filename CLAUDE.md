# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

ローン繰上返済シミュレーター。繰上返済による利息削減額・期間短縮を可視化する静的Webサイト。
収益モデル: AdSense + Amazon/楽天アフィリエイト + A8.net（不動産担保ローン等）

- 本番URL: https://kuriage.simtool.dev/
- リポジトリ: https://github.com/motte12345/kuriage-sim

## コマンド

```bash
npm run dev        # 開発サーバー起動
npm run build      # TypeScriptビルド + Viteビルド + メタタグ静的HTML生成
npm run lint       # ESLint
npm run test       # Vitest全テスト実行
npm run test:watch # Vitest watchモード
npx vitest run src/calc/loan.test.ts  # 単一テストファイル実行
```

## 技術スタック

- React 19 + TypeScript + Vite 8
- React Router DOM (SPA ルーティング、lazy loadでコード分割)
- Recharts (グラフ)
- react-helmet-async (ページ別メタタグ・OGP)
- Vitest + Testing Library (テスト)
- デプロイ: GitHub push → Cloudflare Pages 自動デプロイ

## アーキテクチャ

### 計算エンジン (`src/calc/`)
UIから完全に独立した純粋関数群。全てのローン計算ロジックがここにある。
- `loan.ts` - 元利均等/元金均等の返済スケジュール生成、繰上返済（期間短縮型/返済額軽減型）、借り換え損益計算
- `format.ts` - 円/万円/月数の表示フォーマット
- 入出力の型は `src/types/loan.ts` に定義

**計算の核心**: 繰上返済は指定タイミングの残高から繰上額を差し引き、その後のスケジュールを再計算する。期間短縮型は月額据え置き（残高が0になった時点でループ終了）、返済額軽減型は残期間据え置きで月額を再計算。

### コンポーネント (`src/components/`)
- `Layout.tsx` - ヘッダー/フッター/ナビ/モバイルドロワー
- `Seo.tsx` - ページ別メタタグ・OGP・canonical
- `ComparisonTable.tsx` - 繰上返済なし/期間短縮/返済額軽減の3パターン比較
- `LoanChart.tsx` - 残高推移折れ線グラフ、元金・利息積み上げ棒グラフ
- `ScheduleTable.tsx` - 月別返済スケジュール（折りたたみ）
- `ResultHighlight.tsx` - 結果数値のハイライト表示
- `RelatedTools.tsx` - ページ間回遊リンク
- `FormError.tsx` - バリデーションエラー表示
- `SeoContent.tsx` - SEO用教育コンテンツ（繰上返済の基礎知識等）
- `AffiliateSection.tsx` - Amazon/楽天/A8.netアフィリエイトCTA

### カスタムフック (`src/hooks/`)
- `usePersistedState.ts` - localStorageで入力値を永続化するuseState

### ページ構成
| パス | 内容 |
|---|---|
| `/` | トップ（ヒーロー + ツール一覧カード） |
| `/kuriage` | 繰上返済シミュレーター（メイン、期間短縮 vs 返済額軽減の比較） |
| `/kuriage-multi` | 複数回繰上返済（動的に追加/削除可能） |
| `/karikae` | 借り換えシミュレーター（諸費用込み損益分岐） |
| `/hikaku` | ローン比較ツール（2条件横並び比較） |
| `/about` | 概要・免責・お問い合わせ |

### 差別化ポイント（実装時に意識すること）
1. 期間短縮型と返済額軽減型を**常に並べて比較表示**する（どちらか選ばせるUIにしない）
2. 複数回の繰上返済に対応（各回の効果の内訳も表示）
3. 借り換えは諸費用込みの損益分岐月数を出す

## 金額の扱い

- 計算エンジン内部は全て**円単位**で処理
- UIの入力は**万円単位**で受け付け、calc関数に渡す前に×10,000する
- 年利はUIでは**%表示**、内部では**小数**（1.5% → 0.015）

## SEO

- 各ページに `<Seo>` コンポーネントでtitle / description / OGP / canonical を設定
- `scripts/prerender-meta.mjs` でビルド後に各ルートの静的HTMLを生成（Googlebotがメタタグを即認識）
- `Seo.tsx` と `prerender-meta.mjs` のメタ情報は同一内容を維持すること
- `Seo.tsx` 内の `BASE_URL` がサイトのドメイン（カスタムドメイン設定時に変更）
- `public/sitemap.xml` と `public/robots.txt` を配置済み
- `index.html` に JSON-LD 構造化データ (WebApplication) を埋め込み
- OGP画像: `public/og-image.png` (1200x630, SVGから変換)

## デプロイ

- Cloudflare Pages: ビルドコマンド `npm run build`、出力ディレクトリ `dist`
- SPA対応: `public/_redirects` で全パスを `index.html` にフォールバック + トレイリングスラッシュ301リダイレクト
- セキュリティヘッダー: `public/_headers` で設定
- GA4: `G-GJC6M4SHEC` (index.htmlに直書き)
- AdSense: `ca-pub-6514048542181621` (index.htmlに直書き)

## 収益化

- **AdSense**: index.htmlにスクリプト埋め込み済み
- **Amazon**: アソシエイトID `qp2026-22` — 書籍リンク
- **楽天**: アフィリエイトID `526c1e79.46d4a30e.526c1e7a.3db24b05` — 書籍リンク
- **A8.net**: 丸の内AMS不動産担保ローン — 借り換え/比較ページに配置
- アフィリエイトCTAは計算結果が表示された後にのみ表示（結果なしでは非表示）
