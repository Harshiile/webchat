import { useContext } from 'react'
import { createContext } from 'react'

const [rooms, setRooms] = useState([])
export const roomsContext = createContext(rooms)
export const setRoomsContext = createContext(setRooms)

export const useRooms = () => useContext(roomsContext)
export const useSetRooms = () => useContext(setRoomsContext)