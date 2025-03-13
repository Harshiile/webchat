import { createContext, useContext, useState } from 'react'

const currentRoomContext = createContext()

export const CurrentRoomProvider = ({ children }) => {
    const [currentRoom, setCurrentRoom] = useState({ name: 'WebChat', avatar: '/uploads/user.png', roomId: '' })
    return (
        <currentRoomContext.Provider value={[currentRoom, setCurrentRoom]}>
            {children}
        </currentRoomContext.Provider>
    )
}

export const useCurrentRoom = () => useContext(currentRoomContext)