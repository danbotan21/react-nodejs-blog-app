import { useState } from 'react'
import './CreateBlog.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
export const CreateBlog = () => {
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [created, setCreated] = useState('')
  const [writtenBy, setWrittenBy] = useState('')
  const [description, setDescription] = useState('')
  const [benefits, setBenefits] = useState('')
  const [howToPrepare, setHowToPrepare] = useState('')
  const [date, seteDate] = useState('')

  const navigate = useNavigate()
  const userLoggedIn = JSON.parse(localStorage.getItem('jwtToken'))

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleImageUrlChange = (event) => {
    setImageUrl(event.target.value)
  }

  const handleCreatedChange = (event) => {
    setCreated(event.target.value)
  }

  const handleWrittenByChange = (event) => {
    setWrittenBy(event.target.value)
  }

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value)
  }

  const handleBenefitsChange = (event) => {
    setBenefits(event.target.value)
  }

  const handleHowToPrepareChange = (event) => {
    setHowToPrepare(event.target.value)
  }

  const handleDate = (event) => {
    seteDate(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log('wtf')

    try {
      const response = await axios.post(
        `http://localhost:3001/blogs/new-blog`,
        {
          title,
          imageUrl,
          created,
          writtenBy,
          description,
          benefits,
          howToPrepare,
        }
      )

      alert('Recipe Created')
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='create-blog-parent'>
      <h1 className='create-blog-heading'>Create your own Blog Post Food</h1>

      <form
        className='form'
        onSubmit={
          userLoggedIn
            ? handleSubmit
            : () => {
                alert('You canot create a new blog without being logged in')
                navigate('/')
              }
        }
      >
        <button className='idk' type='submit'>
          Submit here
        </button>

        <div className='blogs-input name-section'>
          <label htmlFor='name'>Write the name of the Blog:</label>
          <input
            type='text'
            name='name'
            id='name'
            value={title}
            onChange={handleTitleChange}
          />
        </div>

        <div className='blogs-input description-section'>
          <label htmlFor='description'>
            Write the description of the Blog post food:
          </label>

          <textarea
            name='description'
            id='description'
            cols='30'
            rows='4'
            value={description}
            onChange={handleDescriptionChange}
          ></textarea>
        </div>

        <div className='blogs-input image-section'>
          <label htmlFor='image'>
            Put a url link to the image you want to have:
          </label>
          <input
            type='text'
            name='image'
            id='image'
            value={imageUrl}
            onChange={handleImageUrlChange}
          />
        </div>

        <div className='blogs-input benefits-section'>
          <label htmlFor='benefits'>
            Write down what benefits bring this food in ordinary days:
          </label>
          <textarea
            name='benefits'
            id='benefits'
            cols='30'
            rows='4'
            value={benefits}
            onChange={handleBenefitsChange}
          ></textarea>
        </div>

        <div className='blogs-input how-to-prepare-section'>
          <label htmlFor='how-to-prepare'>
            Write down how to prepare this food:
          </label>
          <textarea
            name='how-to-prepare'
            id='how-to-prepare'
            cols='30'
            rows='4'
            value={howToPrepare}
            onChange={handleHowToPrepareChange}
          ></textarea>
        </div>

        <div className='blogs-input written-by-section'>
          <label htmlFor='written-by'>Written by:</label>
          <input
            type='text'
            name='written-by'
            id='written-by'
            value={writtenBy}
            onChange={handleWrittenByChange}
          />
        </div>

        <div className='blogs-input date-section'>
          <label htmlFor='date'>Date post created:</label>
          <input
            type='date'
            name='created'
            id='date'
            value={date}
            onChange={handleDate}
          />
        </div>
      </form>
    </div>
  )
}
