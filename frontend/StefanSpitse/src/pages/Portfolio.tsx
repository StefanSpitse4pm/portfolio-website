import { useEffect, useMemo, useState } from 'react'
import { ApiError, downloadPortfolioFile, getPortfolioFiles, login } from '../lib/api'
import type { PortfolioFile } from '../lib/types'
import { useAuth } from '../lib/auth'

const PORTFOLIO_STORAGE_KEY = 'stefan-portfolio-access'
const PORTFOLIO_USERNAME = import.meta.env.VITE_PORTFOLIO_USERNAME ?? 'portfolio'

const Portfolio = () => {
  const { token } = useAuth()
  const [portfolioToken, setPortfolioToken] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [isAuthorizing, setIsAuthorizing] = useState(false)
  const [files, setFiles] = useState<PortfolioFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    const storedToken = localStorage.getItem(PORTFOLIO_STORAGE_KEY)
    if (storedToken) {
      setPortfolioToken(storedToken)
    }
  }, [])

  const accessToken = token ?? portfolioToken

  useEffect(() => {
    let isActive = true

    if (!accessToken) {
      setIsLoading(false)
      return () => {
        isActive = false
      }
    }

    setIsLoading(true)
    getPortfolioFiles(accessToken)
      .then((data) => {
        if (!isActive) return
        setFiles(data)
        setError(null)
      })
      .catch((err: Error) => {
        if (!isActive) return
        if (err instanceof ApiError && err.status === 401) {
          localStorage.removeItem(PORTFOLIO_STORAGE_KEY)
          setPortfolioToken(null)
          setAuthError('Session expired. Enter the password again.')
          setFiles([])
          return
        }
        setError(err.message)
      })
      .finally(() => {
        if (!isActive) return
        setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [accessToken])

  const categories = useMemo(() => {
    const set = new Set<string>()
    files.forEach((file) => {
      if (file.category_name) {
        set.add(file.category_name)
      }
    })
    const list = Array.from(set)
    return ['All', ...list]
  }, [files])

  const filteredFiles = useMemo(() => {
    if (activeCategory === 'All') {
      return files
    }
    return files.filter((file) => file.category_name === activeCategory)
  }, [files, activeCategory])

  useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory('All')
    }
  }, [activeCategory, categories])

  const unlockPortfolio = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAuthError(null)
    setIsAuthorizing(true)

    try {
      const { access_token } = await login(PORTFOLIO_USERNAME, password)
      localStorage.setItem(PORTFOLIO_STORAGE_KEY, access_token)
      setPortfolioToken(access_token)
      setPassword('')
    } catch (err) {
      if (err instanceof Error) {
        setAuthError(err.message)
      }
    } finally {
      setIsAuthorizing(false)
    }
  }

  const clearPortfolioAccess = () => {
    localStorage.removeItem(PORTFOLIO_STORAGE_KEY)
    setPortfolioToken(null)
  }

  const openFile = async (fileId: number) => {
    try {
      const blob = await downloadPortfolioFile(fileId, accessToken)
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank', 'noopener,noreferrer')
      setTimeout(() => URL.revokeObjectURL(url), 60000)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    }
  }

  return (
    <section className="section">
      <header className="section-header">
        <h2>Portfolio</h2>
        <p className="muted">PDF work samples, decks, and documentation.</p>
      </header>

      {!accessToken ? (
        <div className="card portfolio-gate">
          <h3>Portfolio access</h3>
          <p className="muted">Enter the portfolio password to continue.</p>
          <form className="form" onSubmit={unlockPortfolio}>
            <label className="field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            {authError ? <p className="error-text">{authError}</p> : null}
            <button type="submit" className="button primary" disabled={isAuthorizing}>
              {isAuthorizing ? 'Unlocking...' : 'Unlock portfolio'}
            </button>
          </form>
        </div>
      ) : null}

      {accessToken ? (
        <div className="toolbar">
          <div className="toggle-group">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`button toggle${activeCategory === category ? ' active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          {!token && portfolioToken ? (
            <button type="button" className="button text" onClick={clearPortfolioAccess}>
              Lock portfolio
            </button>
          ) : null}
        </div>
      ) : null}

      {accessToken ? (
        <>
          {isLoading ? <p className="muted">Loading files...</p> : null}
          {error ? (
            <div className="callout error">
              <p>{error}</p>
            </div>
          ) : null}

          {!isLoading && !error && filteredFiles.length === 0 ? (
            <p className="muted">No files to show.</p>
          ) : null}

          <div className="list">
            {filteredFiles.map((file) => (
              <div key={file.id} className="list-item">
                <div>
                  <h3>{file.file_name}</h3>
                  <p className="muted">PDF document</p>
                </div>
                <button type="button" className="button primary" onClick={() => openFile(file.id)}>
                  Open PDF
                </button>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </section>
  )
}

export default Portfolio
