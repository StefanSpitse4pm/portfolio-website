import { useState } from 'react'
import { createArticle, createProject, uploadImage, uploadPortfolioFile } from '../libs/api'
import { useAuth } from '../libs/auth'
import { BLOG_ENABLED } from '../libs/features'

const Admin = () => {
  const { token } = useAuth()
  const [projectMessage, setProjectMessage] = useState<string | null>(null)
  const [portfolioMessage, setPortfolioMessage] = useState<string | null>(null)
  const [articleMessage, setArticleMessage] = useState<string | null>(null)
  const [imageMessage, setImageMessage] = useState<string | null>(null)

  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    gh: '',
    article: '',
    date: '',
    technologies: '',
  })

  const [portfolioForm, setPortfolioForm] = useState({
    category: '',
    file: null as File | null,
  })

  const [articleForm, setArticleForm] = useState({
    title: '',
    slug: '',
    coverImage: '',
    status: 'draft',
    createdAt: '',
    publishedAt: '',
    file: null as File | null,
  })

  const [imageFile, setImageFile] = useState<File | null>(null)

  if (!token) {
    return (
      <section className="section">
        <div className="callout error">
          <p>You need to be logged in to access admin tools.</p>
        </div>
      </section>
    )
  }

  const handleProjectSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setProjectMessage(null)

    try {
      const technologies = projectForm.technologies
        .split(',')
        .map((tech) => tech.trim())
        .filter(Boolean)

      await createProject(
        {
          name: projectForm.name,
          description: projectForm.description,
          gh: projectForm.gh,
          article: projectForm.article || undefined,
          date: projectForm.date,
          technologies,
        },
        token,
      )

      setProjectMessage('Project added successfully.')
      setProjectForm({
        name: '',
        description: '',
        gh: '',
        article: '',
        date: '',
        technologies: '',
      })
    } catch (err) {
      if (err instanceof Error) {
        setProjectMessage(err.message)
      }
    }
  }

  const handlePortfolioSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPortfolioMessage(null)

    if (!portfolioForm.file) {
      setPortfolioMessage('Select a PDF to upload.')
      return
    }

    try {
      await uploadPortfolioFile(
        portfolioForm.file,
        portfolioForm.category || null,
        token,
      )
      setPortfolioMessage('Portfolio file uploaded.')
      setPortfolioForm({ category: '', file: null })
    } catch (err) {
      if (err instanceof Error) {
        setPortfolioMessage(err.message)
      }
    }
  }

  const handleArticleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setArticleMessage(null)

    if (!articleForm.file) {
      setArticleMessage('Select a markdown file to upload.')
      return
    }

    const formData = new FormData()
    formData.append('file', articleForm.file)
    formData.append('title', articleForm.title)
    formData.append('slug_', articleForm.slug)
    formData.append('cover_image', articleForm.coverImage)
    formData.append('status', articleForm.status)
    formData.append(
      'created_at',
      new Date(articleForm.createdAt || Date.now()).toISOString(),
    )
    formData.append(
      'published_at',
      new Date(articleForm.publishedAt || Date.now()).toISOString(),
    )

    try {
      await createArticle(formData, token)
      setArticleMessage('Article uploaded.')
      setArticleForm({
        title: '',
        slug: '',
        coverImage: '',
        status: 'draft',
        createdAt: '',
        publishedAt: '',
        file: null,
      })
    } catch (err) {
      if (err instanceof Error) {
        setArticleMessage(err.message)
      }
    }
  }

  const handleImageUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setImageMessage(null)

    if (!imageFile) {
      setImageMessage('Select an image to upload.')
      return
    }

    try {
      const result = await uploadImage(imageFile, token)
      setImageMessage(`Image uploaded: ${result.file_path}`)
      setImageFile(null)
    } catch (err) {
      if (err instanceof Error) {
        setImageMessage(err.message)
      }
    }
  }

  return (
    <section className="section">
      <header className="section-header">
        <h2>Admin</h2>
        <p className="muted">Manage projects and portfolio files.</p>
      </header>

      <div className="stack">
        <form className="form card" onSubmit={handleProjectSubmit}>
          <h3>Add project</h3>
          <label className="field">
            <span>Name</span>
            <input
              type="text"
              value={projectForm.name}
              onChange={(event) =>
                setProjectForm({ ...projectForm, name: event.target.value })
              }
              required
            />
          </label>
          <label className="field">
            <span>Description</span>
            <textarea
              value={projectForm.description}
              onChange={(event) =>
                setProjectForm({
                  ...projectForm,
                  description: event.target.value,
                })
              }
              required
            />
          </label>
          <label className="field">
            <span>GitHub URL</span>
            <input
              type="url"
              value={projectForm.gh}
              onChange={(event) =>
                setProjectForm({ ...projectForm, gh: event.target.value })
              }
              required
            />
          </label>
          <label className="field">
            <span>Article URL</span>
            <input
              type="url"
              value={projectForm.article}
              onChange={(event) =>
                setProjectForm({ ...projectForm, article: event.target.value })
              }
            />
          </label>
          <label className="field">
            <span>Date</span>
            <input
              type="date"
              value={projectForm.date}
              onChange={(event) =>
                setProjectForm({ ...projectForm, date: event.target.value })
              }
              required
            />
          </label>
          <label className="field">
            <span>Technologies (comma separated)</span>
            <input
              type="text"
              value={projectForm.technologies}
              onChange={(event) =>
                setProjectForm({
                  ...projectForm,
                  technologies: event.target.value,
                })
              }
            />
          </label>
          {projectMessage ? <p className="muted">{projectMessage}</p> : null}
          <button type="submit" className="button primary">
            Save project
          </button>
        </form>

        <form className="form card" onSubmit={handlePortfolioSubmit}>
          <h3>Upload portfolio PDF</h3>
          <label className="field">
            <span>Category</span>
            <input
              type="text"
              value={portfolioForm.category}
              onChange={(event) =>
                setPortfolioForm({
                  ...portfolioForm,
                  category: event.target.value,
                })
              }
            />
          </label>
          <label className="field">
            <span>PDF file</span>
            <input
              type="file"
              accept="application/pdf,.pdf,.docx"
              onChange={(event) =>
                setPortfolioForm({
                  ...portfolioForm,
                  file: event.target.files?.[0] ?? null,
                })
              }
              required
            />
          </label>
          {portfolioMessage ? <p className="muted">{portfolioMessage}</p> : null}
          <button type="submit" className="button primary">
            Upload PDF
          </button>
        </form>

        {BLOG_ENABLED ? (
          <>
            <form className="form card" onSubmit={handleArticleSubmit}>
              <h3>Upload blog article</h3>
              <label className="field">
                <span>Title</span>
                <input
                  type="text"
                  value={articleForm.title}
                  onChange={(event) =>
                    setArticleForm({ ...articleForm, title: event.target.value })
                  }
                  required
                />
              </label>
              <label className="field">
                <span>Slug</span>
                <input
                  type="text"
                  value={articleForm.slug}
                  onChange={(event) =>
                    setArticleForm({ ...articleForm, slug: event.target.value })
                  }
                  required
                />
              </label>
              <label className="field">
                <span>Cover image URL</span>
                <input
                  type="text"
                  value={articleForm.coverImage}
                  onChange={(event) =>
                    setArticleForm({
                      ...articleForm,
                      coverImage: event.target.value,
                    })
                  }
                  required
                />
              </label>
              <label className="field">
                <span>Status</span>
                <select
                  value={articleForm.status}
                  onChange={(event) =>
                    setArticleForm({ ...articleForm, status: event.target.value })
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
              <label className="field">
                <span>Created at</span>
                <input
                  type="datetime-local"
                  value={articleForm.createdAt}
                  onChange={(event) =>
                    setArticleForm({
                      ...articleForm,
                      createdAt: event.target.value,
                    })
                  }
                />
              </label>
              <label className="field">
                <span>Published at</span>
                <input
                  type="datetime-local"
                  value={articleForm.publishedAt}
                  onChange={(event) =>
                    setArticleForm({
                      ...articleForm,
                      publishedAt: event.target.value,
                    })
                  }
                />
              </label>
              <label className="field">
                <span>Markdown file</span>
                <input
                  type="file"
                  accept="text/markdown,.md"
                  onChange={(event) =>
                    setArticleForm({
                      ...articleForm,
                      file: event.target.files?.[0] ?? null,
                    })
                  }
                  required
                />
              </label>
              {articleMessage ? <p className="muted">{articleMessage}</p> : null}
              <button type="submit" className="button primary">
                Upload article
              </button>
            </form>

            <form className="form card" onSubmit={handleImageUpload}>
              <h3>Upload blog image</h3>
              <label className="field">
                <span>Image file</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                />
              </label>
              {imageMessage ? <p className="muted">{imageMessage}</p> : null}
              <button type="submit" className="button primary">
                Upload image
              </button>
            </form>
          </>
        ) : null}
      </div>
    </section>
  )
}

export default Admin
