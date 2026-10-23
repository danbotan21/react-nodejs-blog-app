import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import PostCard from '../components/PostCard'
import { api, errorMessage } from '../lib/api'
import { useAuth } from '../lib/auth'

export default function Home() {
  const { user } = useAuth()
  const [posts, setPosts] = useState(null)
  const [search, setSearch] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      api
        .get('/posts', { params: { search } })
        .then(({ data }) => {
          setPosts(data)
          setError(null)
        })
        .catch((err) => setError(errorMessage(err)))
    }, 250)
    return () => clearTimeout(timer)
  }, [search])

  const [featured, ...rest] = posts ?? []
  const showFeatured = featured && !search

  return (
    <div className='mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14'>
      <section className='mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
        <div>
          <h1 className='font-serif text-4xl font-bold text-stone-900 sm:text-5xl'>Cook something good today</h1>
          <p className='mt-3 max-w-xl text-lg text-stone-600'>
            Simple, home-cooked recipes shared by people who love food.
          </p>
        </div>
        <label className='relative block w-full md:w-80'>
          <Search size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-stone-400' />
          <input
            className='field pl-11'
            placeholder='Search recipes'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </section>

      {error && <p className='rounded-2xl bg-rose-50 p-4 text-rose-700'>{error}</p>}

      {!posts && !error && (
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {[1, 2, 3].map((n) => (
            <div key={n} className='h-80 animate-pulse rounded-3xl bg-stone-200/70' />
          ))}
        </div>
      )}

      {posts?.length === 0 && (
        <div className='rounded-3xl border border-dashed border-stone-300 py-16 text-center'>
          <p className='text-lg font-medium text-stone-700'>
            {search ? `No recipes match "${search}".` : 'No recipes yet.'}
          </p>
          {!search && (
            <Link to={user ? '/new' : '/sign-up'} className='btn-primary mt-5'>
              Write the first one
            </Link>
          )}
        </div>
      )}

      {showFeatured && (
        <div className='mb-8'>
          <PostCard post={featured} featured />
        </div>
      )}

      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {(showFeatured ? rest : posts ?? []).map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  )
}
