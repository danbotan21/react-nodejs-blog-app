import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ChefHat, LogOut, PenLine } from 'lucide-react'
import { useAuth } from '../lib/auth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const signOut = () => {
    logout()
    navigate('/')
  }

  return (
    <header className='sticky top-0 z-10 border-b border-stone-200 bg-white/90 backdrop-blur'>
      <nav className='mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 sm:px-6'>
        <Link to='/' className='mr-auto flex items-center gap-2'>
          <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600 text-white'>
            <ChefHat size={20} />
          </span>
          <span className='font-serif text-xl font-bold text-stone-900'>Recipe Blog</span>
        </Link>

        {user ? (
          <>
            <NavLink to='/new' className='btn-primary px-3 sm:px-5'>
              <PenLine size={18} />
              <span className='hidden sm:inline'>Write a recipe</span>
            </NavLink>
            <span
              title={user.name}
              className='ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-semibold text-orange-700'
            >
              {user.name[0].toUpperCase()}
            </span>
            <button onClick={signOut} title='Log out' className='btn-ghost px-3'>
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <>
            <NavLink to='/login' className='btn-ghost'>
              Log in
            </NavLink>
            <NavLink to='/sign-up' className='btn-primary'>
              Sign up
            </NavLink>
          </>
        )}
      </nav>
    </header>
  )
}
