import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { apiUrl, getArticleMarkdown } from '../libs/api'
import { useAuth } from '../libs/auth'

const BlogPost = () => {
  const { slug } = useParams()
  const { token } = useAuth()
  const [content, setContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    let isActive = true
    setIsLoading(true)

    getArticleMarkdown(slug, token)
      .then((data) => {
        if (!isActive) return
        setContent(data)
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
  }, [slug, token])

  const urlTransform = (src: string) => {
    if (src.startsWith('http')) {
      return src
    }
    const normalized = src.startsWith('/') ? src.slice(1) : src
    return apiUrl(`/${normalized}`)
  }

  return (
    <section className="section">
      <header className="section-header">
        <Link to="/blog" className="button text">
          Back to blog
        </Link>
      </header>

      {isLoading ? <p className="muted">Loading article...</p> : null}
      {error ? (
        <div className="callout error">
          <p>{error}</p>
          <p className="muted">
            Article content is protected on the backend right now. Log in to
            access it.
          </p>
        </div>
      ) : null}

      {!isLoading && !error ? (
        <article className="markdown">
          <ReactMarkdown remarkPlugins={[remarkGfm]} urlTransform={urlTransform}>
            {content}
          </ReactMarkdown>
        </article>
      ) : null}
    </section>
  )
}

export default BlogPost
