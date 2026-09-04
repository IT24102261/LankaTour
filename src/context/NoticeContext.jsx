import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const NoticeContext = createContext(null)

export function NoticeProvider({ children }) {
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    if (!notice) return undefined
    const timer = setTimeout(() => setNotice(null), 3200)
    return () => clearTimeout(timer)
  }, [notice])

  const showNotice = useCallback((type, message) => {
    setNotice({ type, message })
  }, [])

  const value = useMemo(
    () => ({
      notice,
      showNotice,
      dismissNotice: () => setNotice(null),
    }),
    [notice, showNotice],
  )

  return <NoticeContext.Provider value={value}>{children}</NoticeContext.Provider>
}

export function useNotice() {
  const context = useContext(NoticeContext)
  if (!context) {
    throw new Error('useNotice must be used inside NoticeProvider')
  }
  return context
}
