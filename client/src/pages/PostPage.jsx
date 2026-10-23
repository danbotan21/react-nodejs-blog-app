import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, Heart, Trash2 } from 'lucide-react'
import { api, errorMessage } from '../lib/api'
import { useAuth } from '../lib/auth'
import { formatDate, readingTime, toSteps } from '../lib/format'
import NotFound from './NotFound'

export default function PostPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [missing, setMissing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .get(`/posts/${id}`)
      .then(({ data }) => setPost(data))
      .catch((err) => (err.response?.status === 404 ? setMissing(true) : setError(errorMessage(err))))
  }, [id])

  const remove = async () => {
    try {
      await api.delete(`/posts/${id}`)
      navigate('/', { replace: true })
    } catch (err) {
      setError(errorMessage(err))
      setConfirming(false)
    }
  }

  if (missing) return <NotFound />
  if (!post) {
    return (
      <div className='mx-auto max-w-3xl px-4 py-14'>
        {error ? (
          <p className='rounded-2xl bg-rose-50 p-4 text-rose-700'>{error}</p>
        ) : (
          <div className='h-96 animate-pulse rounded-3xl bg-stone-200/70' />
        )}
      </div>
    )
  }

  const isAuthor = user && user.id === post.author?._id

  return (
    <article className='mx-auto max-w-3xl px-4 py-10 sm:px-6'>
      <Link to='/' className='inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900'>
        <ArrowLeft size={16} /> All recipes
      </Link>

      <h1 className='mt-5 font-serif text-4xl font-bold text-stone-900 sm:text-5xl'>{post.title}</h1>

      <div className='mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-stone-500'>
        <span className='flex items-center gap-2'>
          <span className='flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 font-semibold text-orange-700'>
            {post.author?.name?.[0]?.toUpperCase() ?? '?'}
          </span>
          <span className='font-medium text-stone-700'>{post.author?.name ?? 'Unknown'}</span>
        </span>
        <span>{formatDate(post.createdAt)}</span>
        <span className='flex items-center gap-1'>
          <Clock size={15} /> {readingTime(post)} min read
        </span>

        {isAuthor && (
          <span className='ml-auto flex items-center gap-2'>
            {confirming ? (
              <>
                <span className='text-stone-700'>Delete this recipe?</span>
                <button onClick={() => setConfirming(false)} className='btn-ghost px-3 py-1.5'>
                  Cancel
                </button>
                <button
                  onClick={remove}
                  className='rounded-xl bg-rose-600 px-3 py-1.5 font-semibold text-white hover:bg-rose-700'
                >
                  Delete
                </button>
              </>
            ) : (
              <button
                onClick={() => setConfirming(true)}
                className='flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-medium text-rose-600 hover:bg-rose-50'
              >
                <Trash2 size={16} /> Delete
              </button>
            )}
          </span>
        )}
      </div>

      {error && <p className='mt-4 rounded-2xl bg-rose-50 p-4 text-rose-700'>{error}</p>}

      <img
        src={post.imageUrl}
        alt={post.title}
        className='mt-8 aspect-[16/10] w-full rounded-3xl bg-stone-100 object-cover shadow-sm'
      />

      <p className='mt-8 text-xl leading-relaxed text-stone-700'>{post.description}</p>

      {post.benefits && (
        <section className='mt-8 rounded-3xl bg-orange-50 p-6'>
          <h2 className='flex items-center gap-2 font-semibold text-orange-800'>
            <Heart size={18} /> Why you will love it
          </h2>
          <p className='mt-2 text-stone-700'>{post.benefits}</p>
        </section>
      )}

      <section className='mt-10'>
        <h2 className='font-serif text-2xl font-bold text-stone-900'>How to prepare</h2>
        <ol className='mt-5 space-y-4'>
          {toSteps(post.howToPrepare).map((step, index) => (
            <li key={index} className='flex gap-4'>
              <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-900 text-sm font-semibold text-white'>
                {index + 1}
              </span>
              <p className='pt-1 leading-relaxed text-stone-700'>{step}</p>
            </li>
          ))}
        </ol>
      </section>
    </article>
  )
}
