import express from 'express'

import cors from 'cors'
import mongoose from 'mongoose'
import { config } from 'dotenv'
config()
import { BlogsRoute } from './routes/Blogs.js'
import { AuthRoute } from './routes/Auth.js'

const app = express()

app.use(express.json())
app.use(cors())
app.use('/blogs', BlogsRoute)
app.use('/auth', AuthRoute)

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)

app.listen(3001, () => console.log('Server Started'))
