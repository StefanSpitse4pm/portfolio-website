import { useEffect, useMemo, useState } from 'react'
import { getProjects } from '../libs/api'
import type { Project } from '../libs/types'
import { useAuth } from '../libs/auth'

const Projects = () => {
  const { token } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    setIsLoading(true)
    getProjects(token)
      .then((data) => {
        if (!isActive) return
        setProjects(data)
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
    return [...projects].sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [projects])

  return (
    <section className="section">
      <header className="section-header">
        <h2>Projects</h2>
        <p className="muted">
          Selected builds, experiments, and engineering work.
        </p>
      </header>

      {isLoading ? <p className="muted">Loading projects...</p> : null}
      {error ? (
        <div className="callout error">
          <p>{error}</p>
          <p className="muted">
            The backend endpoints currently require authentication. Log in if
            you want to view private data.
          </p>
        </div>
      ) : null}

      {!isLoading && !error && sorted.length === 0 ? (
        <p className="muted">No projects yet.</p>
      ) : null}

      <div className="grid cards">
        {sorted.map((project) => (
          <article key={project.id} className="card">
            <div className="card-header">
              <h3>{project.name}</h3>
              <span className="chip">{project.date}</span>
            </div>
            <p className="muted">{project.description}</p>
            <div className="card-actions">
              <a href={project.url} target="_blank" rel="noreferrer" className="button ghost">
                View repository
              </a>
              {project.article ? (
                <a href={project.article} target="_blank" rel="noreferrer" className="button text">
                  Related article
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Projects
