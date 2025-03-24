import { useNavigate, useParams } from 'react-router-dom'
import { useRooms } from '../context/rooms'
import { useCurrentRoom } from '../context/currentRoom';
import { socket } from '../socket';
import { decode, isValid } from 'js-base64'
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useRoomError } from '../context/roomError';

const JoinRoomLink = ({ setRoomJoinError }) => {
    const [rooms, setRooms] = useRooms();
    const [, setRoomError] = useRoomError()
    const [, setCurrentRoom] = useCurrentRoom()
    const navigate = useNavigate()
    let { roomId } = useParams()
    roomId = decode(roomId)

    useEffect(() => {
        fetch('http://localhost:3000/api/v0/room/join', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomId })
        }).then(res => res.json()).then(({ statusCode, message, data }) => {
            if (statusCode == 200) {
                setRooms(rooms => [...rooms, data[0]])
                setCurrentRoom(data[0])
                socket.emit('room-join', { roomId })
            }
            else {
                setRoomError({ error: true, message })
                navigate('/chat')
            }
        })
    }, [])

}

export default JoinRoomLink
