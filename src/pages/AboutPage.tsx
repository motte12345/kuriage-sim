import { Seo } from '../components/Seo'

export function AboutPage() {
  return (
    <>
      <Seo
        title="概要・免責事項"
        description="繰上返済シミュレーターの概要と免責事項。対応ローン種類や計算の前提条件について。"
        path="/about"
      />

      <h1 className="page-title">概要・免責事項</h1>
      <p className="page-description">
        本ツールのご利用前に、以下の内容をご確認ください。
      </p>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <h2 className="section-title">このサイトについて</h2>
        <p>
          繰上返済シミュレーターは、住宅ローンや各種ローンの繰上返済による利息削減効果を
          具体的な数字で確認するためのツールです。期間短縮型と返済額軽減型を並べて比較できるほか、
          複数回の繰上返済や借り換えのシミュレーションにも対応しています。
        </p>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <h2 className="section-title">対応するローンの種類</h2>
        <ul style={{ paddingLeft: '1.25rem', lineHeight: 2.2, color: 'var(--color-text-secondary)' }}>
          <li>住宅ローン</li>
          <li>自動車ローン</li>
          <li>教育ローン・奨学金</li>
          <li>カードローン</li>
          <li>その他の分割払いローン</li>
        </ul>
      </div>

      <div className="card">
        <h2 className="section-title">免責事項</h2>
        <ul style={{ paddingLeft: '1.25rem', lineHeight: 2.2, color: 'var(--color-text-secondary)' }}>
          <li>
            本ツールの計算結果は概算です。実際の返済額は金融機関の計算方法（端数処理、
            返済日の扱い等）により異なります。
          </li>
          <li>
            住宅ローン控除などの税制上の優遇措置は計算に含まれていません。
          </li>
          <li>
            変動金利の将来の金利変動は予測できません。変動金利を入力する場合は、
            想定金利としてご利用ください。
          </li>
          <li>
            本ツールは特定の金融商品を推奨するものではありません。
            実際の借入・借り換えの判断は、金融機関にご相談ください。
          </li>
        </ul>
      </div>

      <div className="card" style={{ marginTop: '1.25rem' }}>
        <h2 className="section-title">お問い合わせ</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          ご意見・ご要望・不具合のご報告は下記メールアドレスまでお願いいたします。
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          <a href="mailto:tm.qp.sites@gmail.com">tm.qp.sites@gmail.com</a>
        </p>
      </div>
    </>
  )
}
