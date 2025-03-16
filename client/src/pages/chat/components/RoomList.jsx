import { motion } from "framer-motion";
import { useEffect } from "react";
import { useCurrentRoom } from "../../../context/currentRoom";
import { useRooms } from "../../../context/rooms";
import { socket } from "../../../socket";

const RoomsList = ({ StoreMessage, setMessages }) => {
    const [currentRoom, setCurrentRoom] = useCurrentRoom()
    const [rooms, setRooms] = useRooms()

    useEffect(() => {
        fetch("http://localhost:3000/api/v0/get/rooms", { credentials: "include" })
            .then((res) => res.json())
            .then(({ statusCode, data }) => {
                if (statusCode === 200) {
                    const rooms = data[0].rooms
                    rooms.map(room => {
                        room.isNewMessages = false
                        return room;
                    })
                    setRooms(rooms)

                    // Initial room joining
                    socket.emit('initial-join', { rooms: rooms.map(room => room.roomId) })
                    if (rooms.length > 0) setCurrentRoom(rooms[0])
                }
            });
    }, [])

    useEffect(() => {
        // Msg Receive
        socket.on('msg-receive', ({ msg, room }) => {
            if (currentRoom.roomId == room) setMessages(prev => [...prev, msg])
            else {
                const newRooms = rooms.map(_room => {
                    if (_room.roomId == room) _room.isNewMessages = true;
                    return _room;
                })
                setRooms(newRooms)
            }
            StoreMessage(msg, room);
        })
        return () => {
            socket.off('msg-receive')
        }
    }, [currentRoom])

    return (
        <div className="space-y-2">
            {rooms && rooms.map((room, index) => (
                <motion.div
                    onClick={() => {
                        room.isNewMessages = false;
                        setCurrentRoom(room)
                    }}
                    key={room.roomId}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition-colors flex items-center gap-x-5"
                >
                    <div className="relative">
                        <img src={`${room.avatar}`} alt="User Avatar" className="w-10 h-10 rounded-full border border-zinc-700" />
                        {
                            room.isNewMessages &&
                            <div className="w-2.5 h-2.5 bg-green-500 absolute rounded-full top-1 right-0"></div>
                        }
                    </div>
                    <p>{room.name}</p>
                </motion.div>
            ))}
        </div>
    );
};

export default RoomsList;