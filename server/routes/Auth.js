import express from 'express'
import mongoose from 'mongoose'
import { User } from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

const router = express.Router()

dotenv.config()

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      status: 'error',
      message: 'Access denied. Token missing.',
    })
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : authHeader

  jwt.verify(
    token,
    process.env.JWT_SECRET ?? 'EUASTAZIVOIINVATASAFACUNBLOGAPPSISPERSASEPRIMEASCABINE',
    (err, user) => {
      if (err) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied. Invalid token.',
        })
      }
      req.user = user
      next()
    }
  )
}

// ---------------------------------------------
// SignUp
router.post('/sign-up', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  try {
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'All of the fields is required ',
      })
    }

    const normalizedEmail = String(email).trim().toLowerCase()

    const userAlreadyExist = await User.findOne({ email: normalizedEmail })
    const nameAlreadyExist = await User.findOne({ name: name })

    if (userAlreadyExist || nameAlreadyExist) {
      return res.status(409).json({
        status: 'error',
        message: 'The User already exist. Please go to login page',
      })
    }

    if (confirmPassword !== password) {
      return res.status(400).json({
        status: 'error',
        message:
          'Please be sure that password and confirmPassword are the same',
      })
    }

    const encryptPassword = await bcrypt.hash(password, 10)
    const encryptPasswordConfirm = await bcrypt.hash(confirmPassword, 10)

    const newUser = await new User({
      name,
      email: normalizedEmail,
      password: encryptPassword,
      confirmPassword: encryptPasswordConfirm,
    })

    await newUser.save()

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET ?? 'EUASTAZIVOIINVATASAFACUNBLOGAPPSISPERSASEPRIMEASCABINE',
      {
        expiresIn: '2h',
      }
    )

    return res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      token,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error.',
    })
  }
})

// -------------------------------------------------

// Log In

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required',
      })
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    const user = await User.findOne({ email: normalizedEmail })

    if (!user) {
      return res.status(401).json({
        message: 'This user doesn`t exist, try to create a new user!   ',
      })
    }

    //  Verificam parola
    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      })
    }

    // Crem token

    const token = jwt.sign(
      { userId: user._id, email: normalizedEmail },
      process.env.JWT_SECRET ?? 'EUASTAZIVOIINVATASAFACUNBLOGAPPSISPERSASEPRIMEASCABINE',
      {
        expiresIn: '2h',
      }
    )

    res.status(200).json({
      status: 'success',
      email,
      name: user.name,
      token,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error.',
    })
  }
})

export { router as AuthRoute }
