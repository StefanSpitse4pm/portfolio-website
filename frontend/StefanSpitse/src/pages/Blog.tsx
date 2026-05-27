import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getArticles } from '../lib/api'
import type { Article } from '../lib/types'
import { useAuth } from '../lib/auth'

const Blog = () => {
  const { token } = useAuth()
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    setIsLoading(true)
    getArticles(token)
      .then((data) => {
        if (!isActive) return
        setArticles(data)
        setError(null)
      })
      .catch((err: Error) => {
        if (!isActive) return
        setError(err.message)
      })
      .finally(() => {
        if (!isActive) return
        setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [token])

  const sorted = useMemo(() => {
    return [...articles].sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
  }, [articles])

  return (
    <section className="section">
      <header className="section-header">
        <h2>Blog</h2>
        <p className="muted">Notes on engineering, process, and exploration.</p>
      </header>

      {isLoading ? <p className="muted">Loading articles...</p> : null}
      {error ? (
        <div className="callout error">
          <p>{error}</p>
          <p className="muted">
            Blog endpoints are protected on the backend right now. Log in to
            access them.
          </p>
        </div>
      ) : null}

      {!isLoading && !error && sorted.length === 0 ? (
        <p className="muted">No posts yet.</p>
      ) : null}

      <div className="grid cards">
        {sorted.map((article) => (
          <article key={article.id} className="card">
            <div className="card-header">
              <h3>{article.title}</h3>
              <span className="chip">{article.status}</span>
            </div>
            <p className="muted">Published: {article.published_at ?? 'Draft'}</p>
            <div className="card-actions">
              <Link to={`/blog/${article.slug}`} className="button primary">
                Read article
              </Link>
              <span className="chip subtle">/{article.slug}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Blog
