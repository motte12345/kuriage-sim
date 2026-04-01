# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

ローン繰上返済シミュレーター。繰上返済による利息削減額・期間短縮を可視化する静的Webサイト。
収益モデル: AdSense + 住宅ローン借り換えアフィリエイト。

## コマンド

```bash
npm run dev        # 開発サーバー起動
npm run build      # TypeScriptビルド + Viteビルド
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
- デプロイ: GitHub → Cloudflare Pages

## アーキテクチャ

### 計算エンジン (`src/calc/`)
UIから完全に独立した純粋関数群。全てのローン計算ロジックがここにある。
- `loan.ts` - 元利均等/元金均等の返済スケジュール生成、繰上返済（期間短縮型/返済額軽減型）、借り換え損益計算
- 入出力の型は `src/types/loan.ts` に定義

**計算の核心**: 繰上返済は指定タイミングの残高から繰上額を差し引き、その後のスケジュールを再計算する。期間短縮型は月額据え置きで残期間を逆算、返済額軽減型は残期間据え置きで月額を再計算。

### ページ構成
| パス | 内容 |
|---|---|
| `/` | トップ（ツール一覧） |
| `/kuriage` | 繰上返済シミュレーター（メイン） |
| `/kuriage-multi` | 複数回繰上返済 |
| `/karikae` | 借り換えシミュレーター |
| `/hikaku` | ローン比較ツール |
| `/about` | 概要・免責 |

### 差別化ポイント（実装時に意識すること）
1. 期間短縮型と返済額軽減型を**常に並べて比較表示**する（どちらか選ばせるUIにしない）
2. 複数回の繰上返済に対応（各回の効果の内訳も表示）
3. 借り換えは諸費用込みの損益分岐月数を出す

## 金額の扱い

- 計算エンジン内部は全て**円単位**で処理
- UIの入力は**万円単位**で受け付け、calc関数に渡す前に×10,000する
- 年利はUIでは**%表示**、内部では**小数**（1.5% → 0.015）

## デプロイ

- Cloudflare Pages: ビルドコマンド `npm run build`、出力ディレクトリ `dist`
- SPA対応: `public/_redirects` で全パスを `index.html` にフォールバック
- セキュリティヘッダー: `public/_headers` で設定
- GA4測定ID・AdSense IDは `index.html` 内のプレースホルダーを置換して設定

## SEO

- 各ページに `<Seo>` コンポーネントでtitle / description / OGP / canonical を設定
- `Seo.tsx` 内の `BASE_URL` がサイトのドメイン（カスタムドメイン設定時に変更）
- `public/sitemap.xml` と `public/robots.txt` を配置済み
- `index.html` に JSON-LD 構造化データ (WebApplication) を埋め込み
