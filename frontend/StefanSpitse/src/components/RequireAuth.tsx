import type { ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth'

const RequireAuth = ({ children }: { children: ReactElement }) => {
  const { token, status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <section className="section">
        <p className="muted">Checking your session...</p>
      </section>
    )
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default RequireAuth
