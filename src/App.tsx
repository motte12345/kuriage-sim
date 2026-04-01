import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })))
const KuriagePage = lazy(() => import('./pages/KuriagePage').then(m => ({ default: m.KuriagePage })))
const KuriageMultiPage = lazy(() => import('./pages/KuriageMultiPage').then(m => ({ default: m.KuriageMultiPage })))
const KarikaePage = lazy(() => import('./pages/KarikaePage').then(m => ({ default: m.KarikaePage })))
const HikakuPage = lazy(() => import('./pages/HikakuPage').then(m => ({ default: m.HikakuPage })))
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })))

function App() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '4rem' }}>読み込み中...</div>}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/kuriage" element={<KuriagePage />} />
          <Route path="/kuriage-multi" element={<KuriageMultiPage />} />
          <Route path="/karikae" element={<KarikaePage />} />
          <Route path="/hikaku" element={<HikakuPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
