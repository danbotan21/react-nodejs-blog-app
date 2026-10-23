import express from 'express'
import cors from 'cors'
import { authRoutes } from './routes/auth.js'
import { postRoutes } from './routes/posts.js'

export const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || '*' }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)

app.use((req, res) => res.status(404).json({ message: 'Not found.' }))

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Something went wrong on the server.' })
})
