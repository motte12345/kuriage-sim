import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'

const tools = [
  {
    to: '/kuriage',
    title: '繰上返済シミュレーター',
    badge: 'メイン',
    description:
      '繰上返済による利息削減額・期間短縮を計算。期間短縮型と返済額軽減型を並べて比較できます。',
  },
  {
    to: '/kuriage-multi',
    title: '複数回繰上返済',
    badge: '拡張',
    description:
      '「3年後に100万、7年後に200万」のように複数回の繰上返済をまとめてシミュレーション。',
  },
  {
    to: '/karikae',
    title: '借り換えシミュレーター',
    badge: '借り換え',
    description:
      '借り換え先の金利と諸費用を入力し、何年で元が取れるか損益分岐点を算出します。',
  },
  {
    to: '/hikaku',
    title: 'ローン比較ツール',
    badge: '比較',
    description:
      '2つのローン条件を横並びで比較。固定金利 vs 変動金利の検討にも使えます。',
  },
]

export function HomePage() {
  return (
    <>
      <Seo
        title="繰上返済シミュレーター"
        description="住宅ローンの繰上返済による利息削減額・期間短縮をシミュレーション。期間短縮型と返済額軽減型の比較、複数回繰上返済、借り換え計算に対応。"
        path="/"
      />
      <div className="page-hero">
        <h1>ローン繰上返済シミュレーター</h1>
        <p>
          繰上返済でどれだけ利息を減らせるか、具体的な数字で確認しましょう
        </p>
      </div>
      <div className="tool-grid">
        {tools.map((tool) => (
          <Link key={tool.to} to={tool.to} className="tool-card">
            <span className="badge">{tool.badge}</span>
            <h2>{tool.title}</h2>
            <p>{tool.description}</p>
          </Link>
        ))}
      </div>
    </>
  )
}
