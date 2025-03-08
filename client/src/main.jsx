import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Chat, Login, Profile, Signup } from './pages'
import { Auth, NoAuth } from './middleware'
import { RoomsProvider } from './context/rooms'
import { CurrentRoomProvider } from './context/currentRoom'

createRoot(document.getElementById('root')).render(
  <RoomsProvider>
    <CurrentRoomProvider>
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
    </CurrentRoomProvider>
  </RoomsProvider >
)
