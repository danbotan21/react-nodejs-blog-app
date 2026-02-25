import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { HomeBlogs } from './components/HomeBlogs/HomeBlogs'
import { ReviewBlog } from './components/ReviewBlog/ReviewBlog'
import { SignUp } from './components/Auth/SignIn'
import { LogIn } from './components/Auth/LogIn'
import { CreateBlog } from './components/CreateBlog/CreateBlog'

function App() {
  const [blogs, setBlogs] = useState([])
  const [blog, setBlog] = useState([])
  const [userExist, setUserExist] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('jwtToken')
    if (token) {
      setUserExist(true)
    } else setUserExist(false)
  }, [])

  const user = JSON.parse(localStorage.getItem('jwtToken'))
  const userName = user ? user.name : ''

  return (
    <>
      <div className='parent-blogs'>
        <nav className='navbar-blogs'>
          <ul>
            {userExist && (
              <div className='user-display'>
                <li>
                  <p className='user-name'>Hi {userName}</p>
                </li>
              </div>
            )}

            <div className='auth'>
              {!userExist && (
                <li>
                  <button className='sign-up-button'>
                    <a href='sign-up' className='sign-up'>
                      Sign UP
                    </a>
                  </button>
                </li>
              )}

              {!userExist ? (
                <li>
                  <button className='log-in-button'>
                    <a href='log-in' className='log-in'>
                      Log In
                    </a>
                  </button>
                </li>
              ) : (
                <li>
                  <button
                    className='log-in-button'
                    onClick={(event) => {
                      event.preventDefault()
                      localStorage.removeItem('jwtToken')
                      window.location.href = '/'
                    }}
                  >
                    <a href='log-in' className='log-in'>
                      Log Out
                    </a>
                  </button>
                </li>
              )}
            </div>
          </ul>
        </nav>

        <Router>
          <Routes>
            <Route
              path='/'
              element={
                <HomeBlogs
                  blogs={blogs}
                  setBlogs={setBlogs}
                  blog={blog}
                  setBlog={setBlog}
                />
              }
            />
            <Route
              path='/blog-review/:id'
              element={
                <ReviewBlog
                  blogs={blogs}
                  setBlogs={setBlogs}
                  blog={blog}
                  setBlog={setBlog}
                />
              }
            />
            <Route path='/create-blog' element={<CreateBlog />} />
            <Route
              path='/sign-up'
              element={<SignUp setUserExist={setUserExist} />}
            />
            <Route
              path='/log-in'
              element={
                <LogIn userExist={userExist} setUserExist={setUserExist} />
              }
            />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
