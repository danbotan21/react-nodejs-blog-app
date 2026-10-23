import { after, before, beforeEach, describe, test } from 'node:test'
import assert from 'node:assert/strict'
import mongoose from 'mongoose'
import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { app } from '../app.js'
import { Post } from '../models/Post.js'
import { User } from '../models/User.js'

process.env.JWT_SECRET = 'test-secret'

const recipe = {
  title: 'Pancakes',
  imageUrl: 'https://example.com/pancakes.jpg',
  description: 'Fluffy pancakes.',
  benefits: 'Quick breakfast.',
  howToPrepare: 'Mix. Fry. Eat.',
}

let mongo

const signUp = async (name) => {
  const res = await request(app).post('/api/auth/sign-up').send({
    name,
    email: `${name}@test.dev`,
    password: 'Password123',
    confirmPassword: 'Password123',
  })
  return res.body.token
}

before(async () => {
  mongo = await MongoMemoryServer.create()
  await mongoose.connect(mongo.getUri())
})

after(async () => {
  await mongoose.disconnect()
  await mongo.stop()
})

beforeEach(async () => {
  await Post.deleteMany({})
  await User.deleteMany({})
})

describe('auth', () => {
  test('sign up and log in return a token, never the password', async () => {
    await signUp('ana')
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ANA@test.dev', password: 'Password123' })

    assert.equal(res.status, 200)
    assert.ok(res.body.token)
    assert.equal(res.body.user.name, 'ana')
    assert.equal(res.body.user.password, undefined)
  })

  test('sign up rejects mismatched passwords and taken emails', async () => {
    const mismatch = await request(app).post('/api/auth/sign-up').send({
      name: 'ana', email: 'ana@test.dev', password: 'Password123', confirmPassword: 'Other12345',
    })
    assert.equal(mismatch.status, 400)

    await signUp('ana')
    const taken = await request(app).post('/api/auth/sign-up').send({
      name: 'ana2', email: 'ana@test.dev', password: 'Password123', confirmPassword: 'Password123',
    })
    assert.equal(taken.status, 409)
  })

  test('wrong password is refused', async () => {
    await signUp('ana')
    const res = await request(app).post('/api/auth/login').send({ email: 'ana@test.dev', password: 'nope' })
    assert.equal(res.status, 401)
  })
})

describe('posts', () => {
  test('creating a post needs a login', async () => {
    const res = await request(app).post('/api/posts').send(recipe)
    assert.equal(res.status, 401)
  })

  test('a logged-in user can create a post and everyone can read it', async () => {
    const token = await signUp('ana')
    const created = await request(app).post('/api/posts').set('Authorization', `Bearer ${token}`).send(recipe)
    assert.equal(created.status, 201)
    assert.equal(created.body.author.name, 'ana')

    const list = await request(app).get('/api/posts')
    assert.deepEqual(list.body.map((p) => p.title), ['Pancakes'])

    const one = await request(app).get(`/api/posts/${created.body._id}`)
    assert.equal(one.body.title, 'Pancakes')
  })

  test('missing fields and bad image links are rejected', async () => {
    const token = await signUp('ana')
    const auth = { Authorization: `Bearer ${token}` }
    assert.equal((await request(app).post('/api/posts').set(auth).send({ title: 'x' })).status, 400)
    assert.equal((await request(app).post('/api/posts').set(auth).send({ ...recipe, imageUrl: 'pancakes.jpg' })).status, 400)
  })

  test('search filters by title', async () => {
    const token = await signUp('ana')
    for (const title of ['Pancakes', 'Pizza', 'Green Salad']) {
      await request(app).post('/api/posts').set('Authorization', `Bearer ${token}`).send({ ...recipe, title })
    }
    const res = await request(app).get('/api/posts').query({ search: 'p' })
    assert.deepEqual(res.body.map((p) => p.title).sort(), ['Pancakes', 'Pizza'])
  })

  test('unknown or invalid ids return 404', async () => {
    assert.equal((await request(app).get('/api/posts/not-an-id')).status, 404)
    assert.equal((await request(app).get(`/api/posts/${new mongoose.Types.ObjectId()}`)).status, 404)
  })

  test('only the author can delete a post', async () => {
    const ana = await signUp('ana')
    const bob = await signUp('bob')
    const { body } = await request(app).post('/api/posts').set('Authorization', `Bearer ${ana}`).send(recipe)

    const byBob = await request(app).delete(`/api/posts/${body._id}`).set('Authorization', `Bearer ${bob}`)
    assert.equal(byBob.status, 403)

    const byAna = await request(app).delete(`/api/posts/${body._id}`).set('Authorization', `Bearer ${ana}`)
    assert.equal(byAna.status, 204)
    assert.equal(await Post.countDocuments(), 0)
  })
})
