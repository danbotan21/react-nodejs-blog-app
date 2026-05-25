import express from 'express'
import mongoose from 'mongoose'
import { BlogReview } from '../models/BlogReviewModel.js'
import { authenticateToken } from './Auth.js'
const router = express.Router()

// Get All the Blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await BlogReview.find({})
    res.status(200).json({
      status: 'success',
      data: blogs,
    })
  } catch (error) {
    console.log(error)

    res.status(404).json({
      message: 'Aici e o eroare',
    })
  }
})

// Read More information about One BLog: =>

router.get('/blog-review/:id', async (req, res) => {
  try {
    const blogId = req.params.id
    const blog = await BlogReview.findById(blogId)

    if (!blog) {
      return res.status(404).json({
        status: 'error',
        message: "This blog aricle doesn't exist yet",
      })
    }

    res.json({
      status: 'success',
      data: blog,
    })
  } catch (error) {
    console.log(error)
  }
})

// Create a new Blog
router.post('/new-blog', async (req, res) => {
  const {
    title, 
    imageUrl,
    created,
    writtenBy,
    description,
    benefits,
    howToPrepare,
  } = req.body

  const newBlog = new BlogReview({
    title,
    imageUrl,
    created,
    writtenBy,
    description,
    benefits,
    howToPrepare,
  })
  try {
    await newBlog.save()
    res.status(201).json({ message: 'Blog creat cu succes!', data: newBlog })
  } catch (error) {
    console.log(error)
  }
})

// Delete a specific Blog

router.delete('/blog-review/:id', async (req, res) => {
  try {
    const blogId = req.params.id
    const blog = await BlogReview.findById(blogId)

    if (!blog) {
      return res.status(404).json({
        status: 'error',
        message: "This blog aricle doesn't exist ",
      })
    }

    await blog.deleteOne()

    res.json({
      status: 'Success deleted',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    })
  }
})

export { router as BlogsRoute }
