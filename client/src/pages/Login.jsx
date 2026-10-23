import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import { api, errorMessage } from '../lib/api'
import { useAuth } from '../lib/auth'

const DEMO = { email: 'demo@blog.app', password: 'BlogDemo123!' }

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const update = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))

  const submit = async (event, credentials = form) => {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const { data } = await api.post('/auth/login', credentials)
      login(data)
      navigate(location.state?.from || '/', { replace: true })
    } catch (err) {
      setError(errorMessage(err))
      setBusy(false)
    }
  }

  return (
    <AuthCard title='Welcome back' subtitle='Log in to share your own recipes.'>
      <form onSubmit={submit} className='space-y-4'>
        <div>
          <label className='label' htmlFor='email'>Email</label>
          <input id='email' name='email' type='email' className='field' value={form.email} onChange={update} required />
        </div>
        <div>
          <label className='label' htmlFor='password'>Password</label>
          <input id='password' name='password' type='password' className='field' value={form.password} onChange={update} required />
        </div>

        {error && <p className='rounded-xl bg-rose-50 p-3 text-sm text-rose-700'>{error}</p>}

        <button type='submit' disabled={busy} className='btn-primary w-full py-3'>
          Log in
        </button>
        <button type='button' disabled={busy} onClick={(e) => submit(e, DEMO)} className='btn-ghost w-full border border-stone-200'>
          Use the demo account
        </button>
      </form>

      <p className='mt-6 text-center text-sm text-stone-600'>
        New here?{' '}
        <Link to='/sign-up' className='font-semibold text-orange-600 hover:underline'>
          Create an account
        </Link>
      </p>
    </AuthCard>
  )
}
