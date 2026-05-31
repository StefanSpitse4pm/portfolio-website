import type { Article, PortfolioFile, Project, ProjectDetail, TokenData } from './types'

const API_URL = import.meta.env.VITE_API_URL

type RequestOptions = RequestInit & {
  token?: string | null
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export const apiUrl = (path: string) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${API_URL}${cleanPath}`
}

const buildInit = (init: RequestInit, token?: string | null) => {
  const headers = new Headers(init.headers ?? {})

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  return {
    ...init,
    headers,
  }
}

const readError = async (res: Response) => {
  let message = res.statusText

  try {
    const data = (await res.json()) as { detail?: string; message?: string }
    message = data.detail ?? data.message ?? message
  } catch {
    // ignore parsing errors
  }

  return new ApiError(res.status, message)
}

const requestJson = async <T>(path: string, options: RequestOptions = {}) => {
  const { token, ...init } = options
  const res = await fetch(apiUrl(path), buildInit(init, token))

  if (!res.ok) {
    throw await readError(res)
  }

  return (await res.json()) as T
}

const requestText = async (path: string, options: RequestOptions = {}) => {
  const { token, ...init } = options
  const res = await fetch(apiUrl(path), buildInit(init, token))

  if (!res.ok) {
    throw await readError(res)
  }

  return res.text()
}

const requestBlob = async (path: string, options: RequestOptions = {}) => {
  const { token, ...init } = options
  const res = await fetch(apiUrl(path), buildInit(init, token))

  if (!res.ok) {
    throw await readError(res)
  }

  return res.blob()
}

export const login = async (username: string, password: string) => {
  const body = new URLSearchParams({
    username,
    password,
  })

  const res = await fetch(apiUrl('/token'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })

  if (!res.ok) {
    throw await readError(res)
  }

  return (await res.json()) as { access_token: string; token_type: string }
}

export const getMe = async (token: string) => {
  return requestJson<TokenData>('/users/me', { token })
}

export const getProjects = async (token?: string | null) => {
  return requestJson<Project[]>('/projects', { token })
}

export const getProjectById = async (projectId: number, token?: string | null) => {
  return requestJson<ProjectDetail>(`/projects/${projectId}`, { token })
}

export const createProject = async (payload: {
  name: string
  description: string
  technologies: string[]
  gh: string
  date: string
  article?: string
}, token: string) => {
  return requestJson<Project>('/project', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  })
}

export const getPortfolioFiles = async (token?: string | null) => {
  return requestJson<PortfolioFile[]>('/portfolio/files', { token })
}

export const uploadPortfolioFile = async (
  file: File,
  category: string | null,
  token: string,
) => {
  const formData = new FormData()
  formData.append('pdf', file)

  const query = category ? `?category=${encodeURIComponent(category)}` : ''

  return requestJson<{ file_id: number }>(`/portfolio/upload-pdf/${query}`, {
    method: 'POST',
    token,
    body: formData,
  })
}

export const downloadPortfolioFile = async (fileId: number, token?: string | null) => {
  return requestBlob(`/portfolio/file/${fileId}`, { token })
}

export const getArticles = async (token?: string | null) => {
  return requestJson<Article[]>('/articles', { token })
}

export const getArticleMarkdown = async (slug: string, token?: string | null) => {
  return requestText(`/article/${slug}`, { token })
}

export const createArticle = async (formData: FormData, token: string) => {
  return requestJson<{ file_id: number }>('/article', {
    method: 'POST',
    token,
    body: formData,
  })
}

export const uploadImage = async (file: File, token: string) => {
  const formData = new FormData()
  formData.append('image', file)

  return requestJson<{ file_path: string }>('/upload-img', {
    method: 'POST',
    token,
    body: formData,
  })
}
