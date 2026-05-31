import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <section className="section">
      <header className="section-header">
        <h2>Page not found</h2>
        <p className="muted">The page you are looking for does not exist.</p>
      </header>
      <Link to="/" className="button primary">
        Return home
      </Link>
    </section>
  )
}

export default NotFound
