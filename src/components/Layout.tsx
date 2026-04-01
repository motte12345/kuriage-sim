import { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // Close drawer on route change
  useEffect(() => {
    setMenuOpen(false) // eslint-disable-line react-hooks/set-state-in-effect
  }, [location.pathname])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const navLinks = [
    { to: '/kuriage', label: '繰上返済' },
    { to: '/kuriage-multi', label: '複数回' },
    { to: '/karikae', label: '借り換え' },
    { to: '/hikaku', label: 'ローン比較' },
    { to: '/about', label: '概要' },
  ]

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <NavLink to="/" className="site-logo">
            繰上返済シミュレーター
          </NavLink>

          {/* Desktop nav */}
          <nav className="site-nav" aria-label="メインナビゲーション">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Hamburger button - mobile only */}
          <button
            className={`nav-hamburger${menuOpen ? ' open' : ''}`}
            aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`mobile-nav-overlay${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <nav
        className={`mobile-nav-drawer${menuOpen ? ' open' : ''}`}
        aria-label="モバイルナビゲーション"
      >
        <div className="mobile-nav-drawer-header">メニュー</div>
        {navLinks.map((link) => (
          <NavLink key={link.to} to={link.to}>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p>
          本ツールの計算結果は概算です。実際の返済額は金融機関により異なります。
        </p>
        <p style={{ marginTop: '0.25rem' }}>
          &copy; {new Date().getFullYear()} 繰上返済シミュレーター
        </p>
      </footer>
    </>
  )
}
