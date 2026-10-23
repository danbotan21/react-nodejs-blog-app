import { Link } from 'react-router-dom'
import { formatDate } from '../lib/format'

export default function PostCard({ post, featured = false }) {
  return (
    <Link
      to={`/posts/${post._id}`}
      className={`group flex overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
        featured ? 'flex-col md:flex-row' : 'flex-col'
      }`}
    >
      <div className={`overflow-hidden bg-stone-100 ${featured ? 'aspect-[4/3] md:w-3/5' : 'aspect-[4/3]'}`}>
        <img
          src={post.imageUrl}
          alt={post.title}
          loading='lazy'
          className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
        />
      </div>

      <div className={`flex flex-1 flex-col p-5 ${featured ? 'md:justify-center md:p-10' : ''}`}>
        {featured && (
          <span className='mb-3 w-fit rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700'>
            Latest recipe
          </span>
        )}
        <h2 className={`font-serif font-bold text-stone-900 ${featured ? 'text-3xl md:text-4xl' : 'text-xl'}`}>
          {post.title}
        </h2>
        <p className={`mt-2 text-stone-600 ${featured ? 'md:text-lg' : 'line-clamp-2'}`}>{post.description}</p>
        <p className='mt-auto pt-4 text-sm text-stone-500'>
          <span className='font-medium text-stone-700'>{post.author?.name ?? 'Unknown'}</span>
          {' · '}
          {formatDate(post.createdAt)}
        </p>
      </div>
    </Link>
  )
}
