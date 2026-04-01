/**
 * SEO用の補足コンテンツ。各ツールページの末尾に配置する教育的テキスト。
 * 「繰上返済とは」「期間短縮型と返済額軽減型の違い」などの長尾キーワード対策。
 */

export function KuriageSeoContent() {
  return (
    <section className="seo-content section-gap">
      <h2 className="section-title">繰上返済の基礎知識</h2>

      <div className="seo-content-block">
        <h3>繰上返済とは</h3>
        <p>
          繰上返済とは、毎月の返済額とは別に、ローンの元金の一部または全部をまとめて返済することです。
          繰上返済した分はすべて元金の返済に充てられるため、その元金にかかるはずだった将来の利息を丸ごと削減できます。
          返済開始から早い時期に行うほど、削減できる利息の総額は大きくなります。
        </p>
      </div>

      <div className="seo-content-block">
        <h3>期間短縮型と返済額軽減型の違い</h3>
        <p>
          繰上返済には「期間短縮型」と「返済額軽減型」の2つの方式があります。
        </p>
        <p>
          <strong>期間短縮型</strong>は、毎月の返済額はそのままで、返済期間を短くする方式です。
          利息の削減効果が大きく、総支払額をより多く減らせるのが特徴です。
          「早くローンを完済したい」「利息をできるだけ減らしたい」方に向いています。
        </p>
        <p>
          <strong>返済額軽減型</strong>は、返済期間はそのままで、毎月の返済額を減らす方式です。
          期間短縮型に比べると利息削減効果は小さくなりますが、家計の月々の負担を軽くできます。
          「月々の支出を抑えたい」「将来の収入減に備えたい」方に向いています。
        </p>
      </div>

      <div className="seo-content-block">
        <h3>繰上返済を行うタイミング</h3>
        <p>
          繰上返済は返済開始から早い時期に行うほど効果が大きくなります。
          ローンの初期は毎月の返済額のうち利息の割合が大きいため、
          元金を減らすことで将来の利息を大幅にカットできます。
          ただし、手元の生活資金（緊急予備資金）を確保した上で行うことが重要です。
        </p>
      </div>

      <div className="seo-content-block">
        <h3>元利均等返済と元金均等返済の違い</h3>
        <p>
          <strong>元利均等返済</strong>は、毎月の返済額（元金＋利息）が一定になる方式です。
          返済計画が立てやすく、住宅ローンで最も一般的に利用されています。
          返済初期は利息の割合が大きく、徐々に元金の割合が増えていきます。
        </p>
        <p>
          <strong>元金均等返済</strong>は、毎月の元金返済額が一定で、利息は残高に応じて減っていく方式です。
          返済初期の負担は大きいですが、総支払利息は元利均等より少なくなります。
        </p>
      </div>
    </section>
  )
}

export function KarikaeSeoContent() {
  return (
    <section className="seo-content section-gap">
      <h2 className="section-title">借り換えの基礎知識</h2>

      <div className="seo-content-block">
        <h3>住宅ローンの借り換えとは</h3>
        <p>
          住宅ローンの借り換えとは、現在返済中のローンを別の金融機関のローンで一括返済し、
          新しい条件で借り直すことです。主に金利が下がった場合に行われ、
          月々の返済額や総支払額の削減が期待できます。
        </p>
      </div>

      <div className="seo-content-block">
        <h3>借り換えにかかる諸費用</h3>
        <p>
          借り換えには以下のような諸費用がかかります。
          これらの費用を含めても得になるかどうかを確認することが重要です。
        </p>
        <ul>
          <li><strong>事務手数料</strong>: 借入額の2.2%程度、または3〜5万円の定額</li>
          <li><strong>保証料</strong>: 借入額の2%程度（ネット銀行は無料の場合あり）</li>
          <li><strong>登記費用</strong>: 抵当権の設定・抹消で10〜20万円程度</li>
          <li><strong>印紙税</strong>: 契約金額に応じて1〜6万円</li>
        </ul>
      </div>

      <div className="seo-content-block">
        <h3>借り換えが有利になる目安</h3>
        <p>
          一般的に、以下の3つの条件を満たすと借り換えのメリットが大きくなると言われています。
        </p>
        <ul>
          <li>金利差が <strong>0.3%以上</strong> ある</li>
          <li>ローン残高が <strong>1,000万円以上</strong> ある</li>
          <li>残りの返済期間が <strong>10年以上</strong> ある</li>
        </ul>
        <p>
          ただし、これはあくまで目安です。本ツールで諸費用込みの損益分岐点を計算し、
          具体的な数字で判断することをおすすめします。
        </p>
      </div>
    </section>
  )
}

export function HikakuSeoContent() {
  return (
    <section className="seo-content section-gap">
      <h2 className="section-title">ローン比較のポイント</h2>

      <div className="seo-content-block">
        <h3>固定金利と変動金利の違い</h3>
        <p>
          <strong>固定金利</strong>は、借入時の金利が返済期間中ずっと変わらない方式です。
          金利上昇リスクがなく返済計画が立てやすい反面、変動金利より金利が高めに設定されます。
        </p>
        <p>
          <strong>変動金利</strong>は、市場金利に連動して定期的に金利が見直される方式です。
          一般的に固定金利より低い金利でスタートできますが、金利上昇時に返済額が増えるリスクがあります。
          変動金利を比較する際は、将来の金利上昇シナリオ（例: +0.5%、+1.0%）も試算すると安心です。
        </p>
      </div>

      <div className="seo-content-block">
        <h3>ローンを比較する際のチェックポイント</h3>
        <ul>
          <li><strong>金利タイプ</strong>: 固定・変動・固定期間選択型の違いを理解する</li>
          <li><strong>総支払額</strong>: 月額だけでなく、返済期間全体の利息総額で比較する</li>
          <li><strong>諸費用</strong>: 事務手数料・保証料が金利に含まれている場合がある</li>
          <li><strong>繰上返済の条件</strong>: 手数料の有無、最低金額、回数制限</li>
          <li><strong>団体信用生命保険</strong>: 金利に上乗せか無料かで実質コストが変わる</li>
        </ul>
      </div>
    </section>
  )
}
