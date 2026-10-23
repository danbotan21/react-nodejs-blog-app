import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className='mx-auto max-w-md px-4 py-24 text-center'>
      <p className='font-serif text-7xl font-bold text-orange-600'>404</p>
      <h1 className='mt-4 text-2xl font-semibold text-stone-900'>This page is not on the menu</h1>
      <p className='mt-2 text-stone-600'>The recipe may have been deleted or the link is wrong.</p>
      <Link to='/' className='btn-primary mt-8'>
        Back to all recipes
      </Link>
    </div>
  )
}
