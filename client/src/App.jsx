import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import PostPage from './pages/PostPage'
import NewPost from './pages/NewPost'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import NotFound from './pages/NotFound'
import RequireAuth from './components/RequireAuth'

export default function App() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />
      <main className='flex-1'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/posts/:id' element={<PostPage />} />
          <Route
            path='/new'
            element={
              <RequireAuth>
                <NewPost />
              </RequireAuth>
            }
          />
          <Route path='/login' element={<Login />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
      <footer className='border-t border-stone-200 py-6 text-center text-sm text-stone-500'>
        Recipe Blog · built with React, Express and MongoDB
      </footer>
    </div>
  )
}
