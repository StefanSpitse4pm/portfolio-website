import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { TokenData } from './types'
import { getMe, login as apiLogin } from './api'

type AuthStatus = 'loading' | 'ready'

type AuthContextValue = {
  token: string | null
  user: TokenData | null
  status: AuthStatus
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const STORAGE_KEY = 'stefan-portfolio-token'

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<TokenData | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEY)
    if (!storedToken) {
      setStatus('ready')
      return
    }

    setToken(storedToken)

    getMe(storedToken)
      .then((data) => {
        setUser(data)
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY)
        setToken(null)
      })
      .finally(() => {
        setStatus('ready')
      })
  }, [])

  const login = async (username: string, password: string) => {
    const { access_token } = await apiLogin(username, password)
    localStorage.setItem(STORAGE_KEY, access_token)
    setToken(access_token)
    const me = await getMe(access_token)
    setUser(me)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({ token, user, status, login, logout }),
    [token, user, status],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
