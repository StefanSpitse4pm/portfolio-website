import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

const Login = () => {
  const { token, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await login(username, password)
      const next =
        (location.state as { from?: { pathname: string } } | null)?.from
          ?.pathname ?? '/admin'
      navigate(next)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="section narrow">
      <header className="section-header">
        <h2>Login</h2>
        <p className="muted">Private access for portfolio management.</p>
      </header>

      {token ? (
        <div className="callout success">
          <p>You are already logged in.</p>
          <Link to="/admin" className="button primary">
            Go to admin
          </Link>
        </div>
      ) : (
        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          <button type="submit" className="button primary" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      )}
    </section>
  )
}

export default Login
