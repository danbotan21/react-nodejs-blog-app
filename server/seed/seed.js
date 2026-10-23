// Adds the demo accounts and recipes. Safe to run more than once.
import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { User } from '../models/User.js'
import { Post } from '../models/Post.js'

export const DEMO_PASSWORD = 'BlogDemo123!'

const emailFor = (name) =>
  name === 'Dan' ? 'demo@blog.app' : `${name.split(' ')[0].toLowerCase()}@blog.app`

export async function seed() {
  const recipes = JSON.parse(await readFile(new URL('./recipes.json', import.meta.url)))
  const password = await bcrypt.hash(DEMO_PASSWORD, 10)

  for (const { author, createdAt, ...recipe } of recipes) {
    const user = await User.findOneAndUpdate(
      { email: emailFor(author) },
      { $setOnInsert: { name: author, password } },
      { upsert: true, new: true }
    )

    // replaceOne keeps the _id of a recipe that is already there
    await Post.collection.replaceOne(
      { title: recipe.title },
      { ...recipe, author: user._id, createdAt: new Date(createdAt), updatedAt: new Date(createdAt) },
      { upsert: true }
    )
  }

  return recipes.length
}

// run directly: npm run seed
if (fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  await mongoose.connect(process.env.MONGODB_URI)
  const count = await seed()
  console.log(`Seeded ${count} recipes. Log in with demo@blog.app / ${DEMO_PASSWORD}`)
  await mongoose.disconnect()
}
