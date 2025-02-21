import { useContext } from 'react'
import { createContext } from 'react'

const currentRoom = createContext()

export const useCurrentRoom = () => useContext(currentRoom)