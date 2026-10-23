import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImageIcon } from 'lucide-react'
import { api, errorMessage } from '../lib/api'

const empty = { title: '', imageUrl: '', description: '', benefits: '', howToPrepare: '' }

export default function NewPost() {
  const navigate = useNavigate()
  const [form, setForm] = useState(empty)
  const [imageFailed, setImageFailed] = useState(false)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const update = (event) => {
    const { name, value } = event.target
    if (name === 'imageUrl') setImageFailed(false)
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const { data } = await api.post('/posts', form)
      navigate(`/posts/${data._id}`)
    } catch (err) {
      setError(errorMessage(err))
      setSaving(false)
    }
  }

  const hasImage = /^https?:\/\//.test(form.imageUrl) && !imageFailed

  return (
    <div className='mx-auto max-w-5xl px-4 py-10 sm:px-6'>
      <h1 className='font-serif text-4xl font-bold text-stone-900'>Share a recipe</h1>
      <p className='mt-2 text-stone-600'>Tell people what you cooked and how they can make it too.</p>

      <form onSubmit={submit} className='mt-8 grid gap-8 lg:grid-cols-[1fr_340px]'>
        <div className='space-y-5'>
          <div>
            <label className='label' htmlFor='title'>Title</label>
            <input id='title' name='title' className='field' placeholder='Lemon garlic pasta' value={form.title} onChange={update} required maxLength={120} />
          </div>

          <div>
            <label className='label' htmlFor='description'>Short description</label>
            <textarea id='description' name='description' rows={3} className='field' placeholder='What is it and when do you make it?' value={form.description} onChange={update} required maxLength={600} />
          </div>

          <div>
            <label className='label' htmlFor='benefits'>
              Why people will love it <span className='font-normal text-stone-400'>(optional)</span>
            </label>
            <textarea id='benefits' name='benefits' rows={2} className='field' placeholder='Quick, cheap, kids love it...' value={form.benefits} onChange={update} maxLength={600} />
          </div>

          <div>
            <label className='label' htmlFor='howToPrepare'>How to prepare</label>
            <textarea id='howToPrepare' name='howToPrepare' rows={7} className='field' placeholder={'One step per line:\nBoil the pasta.\nFry the garlic in butter.\nMix everything with lemon juice.'} value={form.howToPrepare} onChange={update} required maxLength={5000} />
          </div>
        </div>

        <div className='space-y-5'>
          <div>
            <label className='label' htmlFor='imageUrl'>Image link</label>
            <input id='imageUrl' name='imageUrl' type='url' className='field' placeholder='https://...' value={form.imageUrl} onChange={update} required />
          </div>

          <div className='flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-dashed border-stone-300 bg-white'>
            {hasImage ? (
              <img src={form.imageUrl} alt='Preview' className='h-full w-full object-cover' onError={() => setImageFailed(true)} />
            ) : (
              <span className='flex flex-col items-center gap-2 text-sm text-stone-400'>
                <ImageIcon size={28} />
                {imageFailed ? 'This link is not an image' : 'Image preview'}
              </span>
            )}
          </div>

          {error && <p className='rounded-2xl bg-rose-50 p-4 text-sm text-rose-700'>{error}</p>}

          <button type='submit' disabled={saving} className='btn-primary w-full py-3'>
            {saving ? 'Publishing...' : 'Publish recipe'}
          </button>
        </div>
      </form>
    </div>
  )
}
