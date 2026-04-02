/**
 * ビルド後にルートごとの静的HTMLを生成するスクリプト。
 * Googlebotが各ページの正しいtitle/descriptionを即座に認識できるようにする。
 *
 * 仕組み: dist/index.html をテンプレートとして、各ルートのメタタグを差し替えた
 * HTMLファイルを dist/{route}/index.html に配置する。
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')

const SITE_NAME = '繰上返済シミュレーター'
const BASE_URL = 'https://kuriage-sim.pages.dev'

/** @type {{ path: string, title: string, description: string }[]} */
const routes = [
  {
    path: '/',
    title: `${SITE_NAME} | ローン返済計算ツール`,
    description:
      '住宅ローンの繰上返済による利息削減額・期間短縮をシミュレーション。期間短縮型と返済額軽減型の比較、複数回繰上返済、借り換え計算に対応。',
  },
  {
    path: '/kuriage',
    title: `繰上返済の利息削減シミュレーション | ${SITE_NAME}`,
    description:
      '住宅ローンの繰上返済で利息をいくら減らせるか計算。期間短縮型と返済額軽減型を並べて比較し、返済スケジュールとグラフで確認できます。',
  },
  {
    path: '/kuriage-multi',
    title: `複数回繰上返済シミュレーション | ${SITE_NAME}`,
    description:
      '複数回の繰上返済をまとめてシミュレーション。3年後に100万、7年後に200万など、計画的な繰上返済の効果を確認できます。',
  },
  {
    path: '/karikae',
    title: `借り換えシミュレーター | ${SITE_NAME}`,
    description:
      '住宅ローンの借り換えが得か損かを判定。諸費用込みの損益分岐点を計算し、何年で元が取れるか確認できます。',
  },
  {
    path: '/hikaku',
    title: `ローン比較ツール | ${SITE_NAME}`,
    description:
      '2つのローン条件を横並びで比較。月額返済額・総支払額・利息総額の違いを一目で確認。固定金利vs変動金利の検討にも。',
  },
  {
    path: '/about',
    title: `概要・免責事項 | ${SITE_NAME}`,
    description:
      '繰上返済シミュレーターの概要と免責事項。対応ローン種類や計算の前提条件について。',
  },
]

// テンプレートHTML読み込み
const template = readFileSync(join(distDir, 'index.html'), 'utf-8')

let generated = 0

for (const route of routes) {
  const url = `${BASE_URL}${route.path}`

  let html = template
    // title を差し替え
    .replace(
      /<title>[^<]*<\/title>/,
      `<title>${route.title}</title>`,
    )
    // description を差し替え
    .replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${route.description}" />`,
    )

  // canonical を追加（まだなければ）
  if (!html.includes('rel="canonical"')) {
    html = html.replace(
      '</head>',
      `    <link rel="canonical" href="${url}" />\n  </head>`,
    )
  }

  // OGP メタタグを追加
  const ogTags = [
    `<meta property="og:title" content="${route.title}" />`,
    `<meta property="og:description" content="${route.description}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="ja_JP" />`,
    `<meta property="og:image" content="${BASE_URL}/og-image.png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${route.title}" />`,
    `<meta name="twitter:description" content="${route.description}" />`,
    `<meta name="twitter:image" content="${BASE_URL}/og-image.png" />`,
  ].join('\n    ')

  if (!html.includes('og:title')) {
    html = html.replace('</head>', `    ${ogTags}\n  </head>`)
  }

  // ルートパスの場合は dist/index.html を上書き
  if (route.path === '/') {
    writeFileSync(join(distDir, 'index.html'), html)
  } else {
    // dist/{route}/index.html を作成
    const routeDir = join(distDir, route.path.slice(1))
    if (!existsSync(routeDir)) {
      mkdirSync(routeDir, { recursive: true })
    }
    writeFileSync(join(routeDir, 'index.html'), html)
  }

  generated++
  console.log(`  ✓ ${route.path} → ${route.path === '/' ? 'index.html' : route.path.slice(1) + '/index.html'}`)
}

console.log(`\n✅ ${generated} ページのメタタグを静的HTMLに注入しました`)
