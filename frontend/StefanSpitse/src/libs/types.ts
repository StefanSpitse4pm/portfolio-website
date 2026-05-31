export type TokenData = {
  username: string
}

export type Project = {
  id: number
  name: string
  description: string
  url: string
  date: string
  article?: string | null
}

export type ProjectDetail = Project & {
  tag?: string[]
}

export type PortfolioFile = {
  id: number
  file_path: string
  file_name: string
  category_name?: string
}

export type Article = {
  id: number
  title: string
  slug: string
  file_name: string
  file_path: string
  cover_image: string
  status: string
  created_at: string
  published_at: string | null
}
