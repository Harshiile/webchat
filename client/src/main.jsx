import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Chat, Login, Profile, Signup, Messages } from './pages'
import { Auth, NoAuth } from './middleware'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route element={<NoAuth />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/tmp" element={<Messages />} />

        <Route element={<Auth />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
        </Route>
      </Routes>
    </Router>
  </StrictMode>,
)
