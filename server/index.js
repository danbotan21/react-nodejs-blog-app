import 'dotenv/config'
import mongoose from 'mongoose'
import { app } from './app.js'

const PORT = process.env.PORT || 3001

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error('MONGODB_URI and JWT_SECRET must be set (see .env.example).')
  process.exit(1)
}

await mongoose.connect(process.env.MONGODB_URI)
console.log('Connected to MongoDB')

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
