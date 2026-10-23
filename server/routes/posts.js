import express from 'express'
import mongoose from 'mongoose'
import { Post } from '../models/Post.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const findPost = (id) =>
  mongoose.isValidObjectId(id) ? Post.findById(id).populate('author', 'name') : null

// All posts, newest first. ?search= filters by title
router.get('/', async (req, res, next) => {
  try {
    const search = String(req.query.search || '').trim()
    const filter = search ? { title: { $regex: escapeRegex(search), $options: 'i' } } : {}
    const posts = await Post.find(filter).sort({ createdAt: -1 }).populate('author', 'name')
    res.json(posts)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const post = await findPost(req.params.id)
    if (!post) return res.status(404).json({ message: 'This post does not exist.' })
    res.json(post)
  } catch (error) {
    next(error)
  }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { title, imageUrl, description, benefits, howToPrepare } = req.body

    if (!title?.trim() || !imageUrl?.trim() || !description?.trim() || !howToPrepare?.trim()) {
      return res.status(400).json({ message: 'Title, image, description and preparation are required.' })
    }
    if (!/^https?:\/\//i.test(imageUrl.trim())) {
      return res.status(400).json({ message: 'The image must be a link that starts with http:// or https://' })
    }

    const post = await Post.create({ title, imageUrl, description, benefits, howToPrepare, author: req.userId })
    await post.populate('author', 'name')
    res.status(201).json(post)
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Some fields are too long.' })
    }
    next(error)
  }
})

// Only the author can delete a post
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const post = await findPost(req.params.id)
    if (!post) return res.status(404).json({ message: 'This post does not exist.' })
    if (String(post.author?._id) !== req.userId) {
      return res.status(403).json({ message: 'You can only delete your own posts.' })
    }

    await post.deleteOne()
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

export { router as postRoutes }
