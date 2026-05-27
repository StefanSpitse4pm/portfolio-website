import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth'

const Layout = () => {
  const location = useLocation()
  const { token, user, logout } = useAuth()
  const isHome = location.pathname === '/'

  return (
    <div className={`site-shell${isHome ? ' is-home' : ''}`}>
      <header className="site-header" data-variant={isHome ? 'home' : 'default'}>
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            S
          </span>
          <span className="brand-name">Stefan Spitse</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            About
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Projects
          </NavLink>
          <NavLink to="/portfolio" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Portfolio
          </NavLink>
          <NavLink to="/blog" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Blog
          </NavLink>
        </nav>
        <div className="nav-actions">
          {token ? (
            <>
              <Link to="/admin" className="button ghost">
                Admin
              </Link>
              <button type="button" className="button text" onClick={logout}>
                Log out
              </button>
              {user ? <span className="user-chip">{user.username}</span> : null}
            </>
          ) : (
            <Link to="/login" className="button ghost">
              Login
            </Link>
          )}
        </div>
      </header>
      <main className="page">
        <Outlet />
      </main>
      {!isHome ? (
        <footer className="site-footer">
          <span>Available for new projects and collaborations.</span>
          <span>Based in Belgium.</span>
        </footer>
      ) : null}
    </div>
  )
}

export default Layout
