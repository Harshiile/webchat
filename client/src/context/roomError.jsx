import { useContext, useState, createContext } from 'react'

const roomErrorContext = createContext()

export const RoomErrorProvider = ({ children }) => {
    const [roomError, setRoomError] = useState({ error: false, message: '' })
    return (
        <roomErrorContext.Provider value={[roomError, setRoomError]} >
            {children}
        </roomErrorContext.Provider >
    )
}

export const useRoomError = () => useContext(roomErrorContext)