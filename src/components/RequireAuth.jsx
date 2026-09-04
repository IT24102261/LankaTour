import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RequireAuth({ children, role }) {
  const { currentUser, ready } = useAuth()
  const location = useLocation()

  if (!ready) {
    return <p className="px-4 py-10 text-center text-sm text-muted">Loading account...</p>
  }

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (role && currentUser.role !== role) {
    return <Navigate to="/" replace />
  }

  return children
}