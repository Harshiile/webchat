import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Chat, Login, Profile, Signup } from './pages'
import { Auth, NoAuth } from './middleware'
import { RoomsProvider } from './context/rooms'
import { CurrentRoomProvider } from './context/currentRoom'
import JoinRoomLink from './components/JoinRoomLink'
import { RoomErrorProvider } from './context/roomError'

createRoot(document.getElementById('root')).render(
  <RoomsProvider>
    <RoomErrorProvider>
      <CurrentRoomProvider>
        <Router>
          <Routes>
            <Route path="/login" element={
              <NoAuth>
                <Login />
              </NoAuth>
            } />
            <Route path="/signup" element={
              <NoAuth>
                <Login />
              </NoAuth>
            } />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat">
              <Route path='' element={<Chat />} />
              <Route path='room/join/:roomId' element={<JoinRoomLink />} />
            </Route>
          </Routes>
        </Router>
      </CurrentRoomProvider>
    </RoomErrorProvider>
  </RoomsProvider >
)
