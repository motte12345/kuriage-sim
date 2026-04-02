/**
 * アフィリエイトCTAセクション。
 * 計算結果の後に自然な文脈で表示する。
 */

const AMAZON_TAG = 'qp2026-22'
const RAKUTEN_AFF_ID = '526c1e79.46d4a30e.526c1e7a.3db24b05'

interface Book {
  readonly title: string
  readonly amazonAsin: string
  readonly rakutenKeyword: string
  readonly description: string
}

const books: readonly Book[] = [
  {
    title: '住宅ローンで「絶対に損したくない人」が読む本',
    amazonAsin: '4534060645',
    rakutenKeyword: '住宅ローン+絶対に損したくない',
    description: '繰上返済・借り換えの判断基準を解説',
  },
  {
    title: '住宅ローンのしあわせな借り方、返し方',
    amazonAsin: '4534054386',
    rakutenKeyword: '住宅ローン+しあわせな借り方',
    description: 'ライフプランに合わせた返済戦略がわかる',
  },
]

function amazonUrl(asin: string): string {
  return `https://www.amazon.co.jp/dp/${asin}?tag=${AMAZON_TAG}`
}

function rakutenUrl(keyword: string): string {
  return `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_AFF_ID}/?pc=https%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F${encodeURIComponent(keyword)}%2F`
}

/** 繰上返済・複数回繰上返済ページ用 */
export function KuriageAffiliate() {
  return (
    <section className="affiliate-section section-gap">
      <div className="affiliate-header">
        <h2 className="section-title">住宅ローンをもっと賢く返済するために</h2>
        <p className="affiliate-lead">
          繰上返済の効果をさらに最大化するためのおすすめ書籍
        </p>
      </div>
      <div className="affiliate-grid">
        {books.map((book) => (
          <div key={book.amazonAsin} className="affiliate-card">
            <div className="affiliate-card-body">
              <div className="affiliate-card-title">{book.title}</div>
              <p className="affiliate-card-desc">{book.description}</p>
            </div>
            <div className="affiliate-card-links">
              <a
                href={amazonUrl(book.amazonAsin)}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="affiliate-btn affiliate-btn-amazon"
              >
                Amazonで見る
              </a>
              <a
                href={rakutenUrl(book.rakutenKeyword)}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="affiliate-btn affiliate-btn-rakuten"
              >
                楽天で探す
              </a>
            </div>
          </div>
        ))}
      </div>
      <p className="affiliate-disclaimer">
        ※ 上記リンクはアフィリエイトリンクです。購入によりサイト運営費に充てさせていただきます。
      </p>
    </section>
  )
}

/** 借り換えページ用 */
export function KarikaeAffiliate() {
  return (
    <section className="affiliate-section section-gap">
      <div className="affiliate-header">
        <h2 className="section-title">借り換えをさらに詳しく知りたい方へ</h2>
        <p className="affiliate-lead">
          借り換えの判断基準や手続きの流れを詳しく解説
        </p>
      </div>
      <div className="affiliate-grid">
        {books.map((book) => (
          <div key={book.amazonAsin} className="affiliate-card">
            <div className="affiliate-card-body">
              <div className="affiliate-card-title">{book.title}</div>
              <p className="affiliate-card-desc">{book.description}</p>
            </div>
            <div className="affiliate-card-links">
              <a
                href={amazonUrl(book.amazonAsin)}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="affiliate-btn affiliate-btn-amazon"
              >
                Amazonで見る
              </a>
              <a
                href={rakutenUrl(book.rakutenKeyword)}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="affiliate-btn affiliate-btn-rakuten"
              >
                楽天で探す
              </a>
            </div>
          </div>
        ))}
      </div>
      <p className="affiliate-disclaimer">
        ※ 上記リンクはアフィリエイトリンクです。購入によりサイト運営費に充てさせていただきます。
      </p>
    </section>
  )
}

/** 不動産担保ローン（丸の内AMS）- 借り換え・比較ページ用 */
export function FudousanTanpoAffiliate() {
  return (
    <section className="affiliate-section affiliate-section-highlight section-gap">
      <div className="affiliate-header">
        <h2 className="section-title">不動産を担保に、まとまった資金を調達</h2>
        <p className="affiliate-lead">
          住宅ローン返済中でも申込OK。複数の借入を一本化して月々の返済を軽くする方法も。
        </p>
      </div>

      <div className="affiliate-card-wide">
        <div className="affiliate-card-wide-body">
          <div className="affiliate-card-badge">PR</div>
          <div className="affiliate-card-title">
            丸の内AMSの不動産担保ローン
          </div>
          <ul className="affiliate-features">
            <li>審査は<strong>最短当日</strong>、融資は<strong>最短2日</strong></li>
            <li>融資金額 <strong>500万〜5億円</strong></li>
            <li>住宅ローン返済中でも申込可</li>
            <li>銀行で断られた物件でも相談可</li>
            <li>年齢不問・共有持分にも対応</li>
          </ul>
          <p className="affiliate-card-note">
            ※ 対象エリア：東京都・神奈川県・埼玉県・千葉県（一都三県）
          </p>
        </div>
        <div className="affiliate-card-wide-action">
          <a
            href="https://px.a8.net/svt/ejp?a8mat=4B1BLH+F75DPU+5PBE+5YJRM"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="affiliate-btn affiliate-btn-cta"
          >
            無料で相談する
          </a>
          <img
            src="https://www16.a8.net/0.gif?a8mat=4B1BLH+F75DPU+5PBE+5YJRM"
            width="1"
            height="1"
            alt=""
            style={{ position: 'absolute', opacity: 0 }}
          />
          <span className="affiliate-btn-sub">審査無料・最短当日回答</span>
        </div>
      </div>

      <p className="affiliate-disclaimer">
        ※ 広告・PRを含みます。サービスの詳細は公式サイトをご確認ください。
      </p>
    </section>
  )
}
