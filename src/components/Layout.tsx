import { Outlet, NavLink } from 'react-router-dom'

export function Layout() {
  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <NavLink to="/" className="site-logo">
            繰上返済シミュレーター
          </NavLink>
          <nav className="site-nav">
            <NavLink to="/kuriage">繰上返済</NavLink>
            <NavLink to="/kuriage-multi">複数回</NavLink>
            <NavLink to="/karikae">借り換え</NavLink>
            <NavLink to="/hikaku">ローン比較</NavLink>
            <NavLink to="/about">概要</NavLink>
          </nav>
        </div>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>
          本ツールの計算結果は概算です。実際の返済額は金融機関により異なります。
        </p>
        <p>&copy; {new Date().getFullYear()} 繰上返済シミュレーター</p>
      </footer>
    </>
  )
}
