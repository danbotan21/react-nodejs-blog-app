import { useEffect, useState } from 'react'
import axios from 'axios'
import './HomeBlogs.css'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

export const HomeBlogs = ({ blog, setBlog, blogs, setBlogs }) => {
  useEffect(() => {
    const getAllBlogs = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/blogs`)
        setBlogs(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    getAllBlogs()
  }, [])

  const userLoggedIn = JSON.parse(localStorage.getItem('jwtToken'))

  const readBlog = async (idBlog) => {
    try {
      const getBlog = await axios.get(
        `http://localhost:3001/blogs/blog-review/${idBlog}`
      )

      setBlog(getBlog.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteBlog = async (idBlog) => {
    try {
      const getBlog = await axios.delete(
        `http://localhost:3001/blogs/blog-review/${idBlog}`
      )

      alert('The blog was deleted')
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div className='parent-blog-posts'>
      <h1 className='main-title text-center mb-5 mt-2'>All Blogs Review</h1>
      <div className='create-new-blog text-center '>
        <button>
          <a href='create-blog'> Create your own blog with food</a>
        </button>
      </div>

      {/* Blogs right Here */}
      <div className='blogs'>
        {blogs.map((blog, index) => (
          <div className='blog' key={index}>
            <div className='blog-sections-content'>
              <div className='blog-heading'>
                <h3 className='title-blog'>{blog.title}</h3>
              </div>
              <div className='blog-image'>
                <img
                  className='img-blog'
                  src={blog.imageUrl}
                  alt={blog.title}
                />
              </div>
            </div>
            <div className='extra-info'>
              <Link to={`blog-review/${blog._id}`}>
                <button
                  className='read-blog text-info bg-success text-white'
                  onClick={() => readBlog(blog._id)}
                >
                  More information about Blog
                </button>
              </Link>

              {userLoggedIn != null ? (
                <button
                  className='delete-blog bg-danger text-light'
                  onClick={() => deleteBlog(blog._id)}
                >
                  Delete this Blog
                </button>
              ) : (
                <button
                  className='delete-blog bg-danger text-light'
                  onClick={() =>
                    alert('You cant delete a blog until you are not logged in ')
                  }
                >
                  Delete this Blog
                </button>
              )}

              <p className='author'>
                <span className='by-author'>Written by: </span>
                {blog.writtenBy}
              </p>
              <p className='date-created'>
                {/* Created: {blog.created.substring(0, 10)} */}
                Created: {blog.created}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
