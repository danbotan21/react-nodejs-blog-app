import { useEffect, useState } from 'react'
import './Auth.css'
import axios from 'axios'

export const SignUp = ({ setUserExist }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorHandling, setErrorHandling] = useState('')

  const handleName = (e) => {
    setName(e.target.value)
  }
  const handleEmail = (e) => {
    setEmail(e.target.value)
  }

  const handlePassword = (e) => {
    setPassword(e.target.value)
  }

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value)
  }

  const handleSubmit = async (event) => {
    try {
      event.preventDefault()

      const response = await axios.post(`http://localhost:3001/auth/sign-up`, {
        name,
        email,
        password,
        confirmPassword,
      })

      const { token, name: NameUser } = response.data
      localStorage.removeItem('jwtToken')

      // localStorage.setItem('jwtToken', JSON.stringify({ token: token }))

      // axios.defaults.headers.common['Authorization'] = 'Bearer' + token
      window.location.href = 'log-in'

      setName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setErrorHandling('')
    } catch (error) {
      setErrorHandling(error.response.data.message)
    }
  }

  return (
    <div className='sign-up-parent'>
      <div className='header-sign-up-class'>
        <h1 className='sign-up-header'>SignUp Page</h1>
      </div>

      <div className='error-display'>
        {errorHandling !== '' && (
          <p className='error-header'> {errorHandling} </p>
        )}
      </div>

      <div className='sing-up-content'>
        <form className='form-sign-up' onSubmit={handleSubmit}>
          <h3 className='header-content'>Register</h3>

          <input
            type='text'
            className='content-sign-up name-sign-up'
            name='name'
            id='name'
            value={name}
            onChange={handleName}
            placeholder='Name'
          />

          <input
            type='email'
            className='content-sign-up email-sign-up'
            name='email'
            id='email'
            value={email}
            onChange={handleEmail}
            placeholder='Email'
          />

          <input
            type='password'
            className='content-sign-up password-sign-up'
            name='password'
            id='password'
            value={password}
            onChange={handlePassword}
            placeholder='Password'
          />

          <input
            type='password'
            className='content-sign-up'
            name='confirm-password'
            id='confirm-password'
            value={confirmPassword}
            onChange={handleConfirmPassword}
            placeholder='Confirm Password'
          />

          <button className='btn-signup' type='submit'>
            Sign Up
          </button>

          <p className='have-an-account'>
            Have an Account? <a href='log-in'>Login Here</a>
          </p>
        </form>
      </div>
    </div>
  )
}
