import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <section className="hero">
      <div className="hero-visual" aria-hidden="true" />
      <div className="hero-content">
        <p className="hero-eyebrow">Stefan Spitse</p>
        <h1 className="hero-title">
          Building high-clarity products with a focus on systems, detail, and
          impact.
        </h1>
        <p className="hero-subtitle">
          A curated collection of projects, portfolio work, and technical notes.
        </p>
        <div className="hero-actions">
          <Link to="/projects" className="button primary">
            Enter the work
          </Link>
          <Link to="/blog" className="button text">
            Read the blog
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Home
