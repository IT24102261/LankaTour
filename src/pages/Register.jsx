import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotice } from '../context/NoticeContext'

export default function Register() {
  const { register, currentUser, ready } = useAuth()
  const { showNotice } = useNotice()
  const navigate = useNavigate()
  const [name, setName] = useState('')
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
    if (!name.trim() || !email.trim() || !password) {
      setError('Please enter your name, email and password.')
      return
    }
    if (password.length < 6) {
      setError('Please choose a password with at least 6 characters.')
      return
    }
    const result = await register(name, email, password)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setError('')
    showNotice('success', 'Welcome to LankaTour. You can now share feedback.')
    navigate('/profile')
  }

  const fieldClass =
    'w-full rounded-xl border border-jungle/15 bg-white px-3 py-3 text-sm outline-none ring-gold/40 focus:ring-2'

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl text-jungle">Create a traveller account</h1>
      <p className="mt-3 text-muted">Use this account to rate places and send feedback to LankaTour.</p>
      <form onSubmit={handleSubmit} className="mt-8 rounded-3xl border border-jungle/10 bg-white p-6 shadow-sm">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Full name</span>
          <input className={fieldClass} value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Email</span>
          <input
            type="email"
            className={fieldClass}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Password</span>
          <input
            type="password"
            className={fieldClass}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error ? (
          <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900" role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" className="mt-6 w-full rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-jungle-deep">
          Create account
        </button>
        <p className="mt-4 text-center text-sm text-muted">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-palm">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}
