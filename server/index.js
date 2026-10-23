import 'dotenv/config'
import dns from 'node:dns'
import mongoose from 'mongoose'
import { app } from './app.js'

const PORT = process.env.PORT || 3001

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error('MONGODB_URI and JWT_SECRET must be set (see .env.example).')
  process.exit(1)
}

// Some Windows setups can't resolve mongodb+srv:// addresses with the default DNS
if (process.env.DNS_SERVERS) dns.setServers(process.env.DNS_SERVERS.split(','))

await mongoose.connect(process.env.MONGODB_URI)
console.log('Connected to MongoDB')

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
