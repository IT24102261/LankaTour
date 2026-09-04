import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import api, { getErrorMessage, setToken, TOKEN_KEY } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setReady(true)
      return undefined
    }
    api
      .get('/auth/me')
      .then((response) => setCurrentUser(response.data.user))
      .catch(() => setToken(null))
      .finally(() => setReady(true))
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setToken(data.token)
      setCurrentUser(data.user)
      return { ok: true, user: data.user }
    } catch (error) {
      return { ok: false, message: getErrorMessage(error, 'Invalid email or password. Please try again.') }
    }
  }, [])

  const register = useCallback(async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password })
      setToken(data.token)
      setCurrentUser(data.user)
      return { ok: true, user: data.user }
    } catch (error) {
      return { ok: false, message: getErrorMessage(error, 'Could not create the account.') }
    }
  }, [])

  const updateProfile = useCallback(async (updates) => {
    const { data } = await api.put('/auth/me', updates)
    setCurrentUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
    setToken(null)
  }, [])

  const value = useMemo(
    () => ({
      currentUser,
      ready,
      isAdmin: currentUser?.role === 'admin',
      isLoggedIn: Boolean(currentUser),
      login,
      register,
      updateProfile,
      logout,
    }),
    [currentUser, ready, login, register, updateProfile, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
