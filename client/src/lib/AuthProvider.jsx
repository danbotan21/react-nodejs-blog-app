import { useEffect, useState } from 'react'
import { AuthContext } from './auth'
import { api, clearSession, getSession, saveSession } from './api'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSession()?.user ?? null)

  // a saved token can expire, so check it once on load
  useEffect(() => {
    if (!getSession()) return
    api.get('/auth/me').then(
      ({ data }) => setUser(data),
      (error) => {
        if (error.response?.status === 401) {
          clearSession()
          setUser(null)
        }
      }
    )
  }, [])

  const login = (session) => {
    saveSession(session)
    setUser(session.user)
  }

  const logout = () => {
    clearSession()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}
