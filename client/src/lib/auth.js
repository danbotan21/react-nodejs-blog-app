import { createContext, useContext } from 'react'

export const AuthContext = createContext(null)

// { user, login(session), logout() }
export const useAuth = () => useContext(AuthContext)
