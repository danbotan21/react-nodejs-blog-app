import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth'

// Sends visitors to the login page and brings them back afterwards
export default function RequireAuth({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to='/login' replace state={{ from: location.pathname }} />
  return children
}
