import { Helmet } from 'react-helmet-async'

interface SeoProps {
  readonly title: string
  readonly description: string
  readonly path: string
}

const SITE_NAME = '繰上返済シミュレーター'
const BASE_URL = 'https://kuriage-sim.pages.dev'

export function Seo({ title, description, path }: SeoProps) {
  const fullTitle = path === '/' ? `${SITE_NAME} | ローン返済計算ツール` : `${title} | ${SITE_NAME}`
  const url = `${BASE_URL}${path}`
  const ogImage = `${BASE_URL}/og-image.png`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {/* OGP */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="ja_JP" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  )
}
