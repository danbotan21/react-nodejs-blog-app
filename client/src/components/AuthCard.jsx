import { ChefHat } from 'lucide-react'

export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className='flex justify-center px-4 py-12 sm:py-20'>
      <div className='w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-sm'>
        <span className='flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600'>
          <ChefHat size={24} />
        </span>
        <h1 className='mt-5 font-serif text-3xl font-bold text-stone-900'>{title}</h1>
        <p className='mt-1 text-stone-600'>{subtitle}</p>
        <div className='mt-7'>{children}</div>
      </div>
    </div>
  )
}
