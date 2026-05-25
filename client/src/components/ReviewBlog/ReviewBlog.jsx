import axios from 'axios'
import './ReviewBlog.css'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export const ReviewBlog = () => {
  const { id } = useParams() // Utilizați useParams pentru a obține ID-ul din URL

  const styleTest = {
    backgroundImage:
      'url("https://images.pexels.com/photos/349610/pexels-photo-349610.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'bottom',
    backgroundSize: 'cover',
    width: '100%',
    height: 'auto',
    marginTop: '30px',
    borderRadius: '12px',
  }

  const [blogArticle, setBlogArticle] = useState({})

  useEffect(() => {
    const getProduct = async () => {
      try {
        if (id === 'sign-up') {
          window.location.href = '/sign-up'
        }

        if (id === 'log-in') {
          window.location.href = '/log-in'
        }

        const response = await axios.get(
          `http://localhost:3001/blogs/blog-review/${id}`
        )

        console.log(id)

        setBlogArticle(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    getProduct()
  }, [id]) // Adăugați [id] ca dependență pentru a solicita datele blogului la fiecare modificare a ID-ului

  return (
    <div className='review-blog-parent'>
      <div className='title-blog'>
        <h1 className='blog-heading'>{blogArticle.title}</h1>
      </div>

      <div className='main-content-blog'>
        <section className='image-blog-parent'>
          <img src={blogArticle.imageUrl} alt='image' />
        </section>
        <section className='description-parent'>
          <h2 className='header-description'>Description:</h2>
          <p className='text-description'>{blogArticle.description}</p>
        </section>
      </div>

      <hr />

      <section className='benefits' style={styleTest}>
        <h2 className='header-benefits'>Benefits</h2>
        <p className='benefits-text'>{blogArticle.benefits}</p>
      </section>

      <section className='how-to-prepare'>
        <h2 className='header-prepare-instructions'>
          <span>How to Prepare:</span>
        </h2>
        <p className='how-to-prepare-text'>{blogArticle.howToPrepare}</p>
      </section>
    </div>
  )
}
