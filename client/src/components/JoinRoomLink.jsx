import { useNavigate, useParams } from 'react-router-dom'
import { useRooms } from '../context/rooms'
import { useCurrentRoom } from '../context/currentRoom';
import { socket } from '../socket';
import { decode, isValid } from 'js-base64'
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useRoomError } from '../context/roomError';
const JoinRoomLink = () => {
    const [rooms, setRooms] = useRooms();
    const [, setRoomError] = useRoomError()
    const [, setCurrentRoom] = useCurrentRoom()
    let { roomId } = useParams()
    roomId = decode(roomId)

    useEffect(() => {
        if (isValid(roomId)) {

            fetch("http://localhost:3000/api/v0/room/exist", {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ roomId })
            })
                .then((res) => res.json())
                .then(({ statusCode, data, message }) => {
                    if (statusCode === 200) {
                        const { isRoomExist } = data[0];
                        if (isRoomExist) {
                            // is user already in same room?
                            fetch("http://localhost:3000/api/v0/get/rooms", { credentials: "include" })
                                .then((res) => res.json())
                                .then(({ statusCode, data, message }) => {
                                    if (statusCode === 200) {
                                        const { rooms } = data[0];
                                        console.log(rooms);

                                        if (!rooms.map(room => room.roomId).includes(roomId)) {
                                            // user can join room
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
                                            })
                                        }
                                        window.location.href = '/chat'
                                    }
                                });
                        }
                        else {
                            setRoomError(true)
                        }
                    }
                });
        }
        else {
            console.log('RoomId is not valid');
        }
    }, [])

}

export default JoinRoomLink
