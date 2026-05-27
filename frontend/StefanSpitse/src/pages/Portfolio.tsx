import { useEffect, useMemo, useState } from 'react'
import { downloadPortfolioFile, getPortfolioFiles } from '../lib/api'
import type { PortfolioFile } from '../lib/types'
import { useAuth } from '../lib/auth'

const Portfolio = () => {
  const { token } = useAuth()
  const [files, setFiles] = useState<PortfolioFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)

  useEffect(() => {
    let isActive = true

    setIsLoading(true)
    getPortfolioFiles(token)
      .then((data) => {
        if (!isActive) return
        setFiles(data)
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

  const activeCategory = categories[activeCategoryIndex] ?? 'All'

  const filteredFiles = useMemo(() => {
    if (activeCategory === 'All') {
      return files
    }
    return files.filter((file) => file.category_name === activeCategory)
  }, [files, activeCategory])

  const cycleCategory = () => {
    setActiveCategoryIndex((prev) => (prev + 1) % categories.length)
  }

  const openFile = async (fileId: number) => {
    try {
      const blob = await downloadPortfolioFile(fileId, token)
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

      <div className="toolbar">
        <button type="button" className="button ghost" onClick={cycleCategory}>
          Category: {activeCategory}
        </button>
        <p className="muted">Click to cycle through categories.</p>
      </div>

      {isLoading ? <p className="muted">Loading files...</p> : null}
      {error ? (
        <div className="callout error">
          <p>{error}</p>
          <p className="muted">
            Portfolio endpoints are protected on the backend right now. Log in
            to access them.
          </p>
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
    </section>
  )
}

export default Portfolio
