import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Chat, Login, Profile, Signup } from './pages'
import { Auth, NoAuth } from './middleware'
import { RoomsProvider } from './context/rooms'
import { CurrentRoomProvider } from './context/currentRoom'
import JoinRoomLink from './components/JoinRoomLink'
import { RoomErrorProvider } from './context/roomError'
import { HelmetProvider } from 'react-helmet-async'

createRoot(document.getElementById('root')).render(
  <HelmetProvider>
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
                  <Signup />
                </NoAuth>
              } />
              <Route path="/profile" element={
                <Auth>
                  <Profile />
                </Auth>
              } />
              <Route path="/chat">
                <Route path='' element={
                  <Auth>
                    <Chat />
                  </Auth>
                } />
                <Route path='room/join/:roomId' element={
                  <Auth>
                    <JoinRoomLink />
                  </Auth>
                } />
              </Route>
            </Routes>
          </Router>
        </CurrentRoomProvider>
      </RoomErrorProvider>
    </RoomsProvider >
  </HelmetProvider>
)
