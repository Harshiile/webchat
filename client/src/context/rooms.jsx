import { useContext, useState, createContext } from 'react'

const roomsContext = createContext()

export const RoomsProvider = ({ children }) => {
    const [rooms, setRooms] = useState([])

    return (
        <roomsContext.Provider value={[rooms, setRooms]} >
            {children}
        </roomsContext.Provider >
    )
}

export const useRooms = () => useContext(roomsContext)