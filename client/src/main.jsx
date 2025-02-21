import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Chat, Login, Profile, Signup } from './pages'
import { Auth, NoAuth } from './middleware'
import { rooms } from './context/rooms'

createRoot(document.getElementById('root')).render(
  <rooms.Provider value={rooms}>
    <Router>
      <Routes>
        <Route element={<NoAuth />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/signup" element={<Signup />} />

        <Route element={<Auth />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
        </Route>
      </Routes>
    </Router>
  </rooms.Provider>
)
