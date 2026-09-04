import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotice } from '../context/NoticeContext'

export default function Login() {
  const { login, currentUser, ready } = useAuth()
  const { showNotice } = useNotice()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (!ready) {
    return <p className="px-4 py-10 text-center text-sm text-muted">Loading account...</p>
  }

  if (currentUser) {
    return <Navigate to="/profile" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!email.trim() || !password) {
      setError('Please enter both your email and password.')
      return
    }
    const result = await login(email, password)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setError('')
    showNotice('success', `Welcome back, ${result.user.name}.`)
    navigate('/profile')
  }

  const fieldClass =
    'w-full rounded-xl border border-jungle/15 bg-white px-3 py-3 text-sm outline-none ring-gold/40 focus:ring-2'

  return (
    <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center">
      <div className="overflow-hidden rounded-[2rem] shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"
          alt="Sri Lanka temple"
          className="h-64 w-full object-cover lg:h-[28rem]"
        />
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-palm">Account</p>
        <h1 className="mt-2 font-display text-4xl text-jungle">Log in to LankaTour</h1>
        <p className="mt-3 text-muted">
          Sign in to plan trips, leave feedback and save your Sri Lanka journey.
        </p>
      <form onSubmit={handleSubmit} className="mt-8 rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_24px_60px_rgba(18,56,44,0.12)] sm:p-8">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={fieldClass}
            placeholder="you@email.com"
            autoComplete="email"
          />
        </label>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={fieldClass}
            placeholder="Your password"
            autoComplete="current-password"
          />
        </label>
        {error ? (
          <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-jungle px-4 py-3 text-sm font-semibold text-sand"
        >
          Log in
        </button>
        <p className="mt-4 text-center text-sm text-muted">
          New traveller?{' '}
          <Link to="/register" className="font-semibold text-palm">
            Create an account
          </Link>
        </p>
      </form>
      </div>
    </div>
  )
}
