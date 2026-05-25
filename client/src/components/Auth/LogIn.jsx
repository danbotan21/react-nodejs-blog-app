import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

export const LogIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorHandling, setErrorHandling] = useState('')

  const handleEmail = (e) => {
    setEmail(e.target.value)
  }

  const handlePassword = (e) => {
    setPassword(e.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.post(
        `http://localhost:3001/auth/login`,
        {
          email,
          password,
        }
      )

      const { token, name: NameUser } = response.data
      localStorage.setItem(
        'jwtToken',
        JSON.stringify({ name: NameUser, token: token })
      )

      window.location.href = '/'
    } catch (error) {
      console.log(error)
      setErrorHandling(error.response.data.message)
    }
  }

  return (
    <div className='log-in-parent'>
      <div className='header-log-in-class'>
        <h1 className='sign-up-header'>LogIn Page</h1>
      </div>

      <div className='error-display'>
        {errorHandling !== '' && (
          <p className='error-header'> {errorHandling} </p>
        )}
      </div>

      <div className='log-in-content'>
        <form className='form-log-in' onSubmit={handleSubmit}>
          <h3 className='header-content'>LogIn</h3>

          <input
            type='email'
            className='content-log-in '
            name='email'
            id='email'
            onChange={handleEmail}
            placeholder='Email'
          />

          <input
            type='password'
            className='content-log-in'
            name='password'
            id='password'
            onChange={handlePassword}
            placeholder='Password'
          />

          <button className='btn-log-in '>LogIn</button>

          <p className='have-an-account'>
            Not a member? <a href='sign-up'>Sign Up Now</a>
          </p>
        </form>
      </div>
    </div>
  )
}
