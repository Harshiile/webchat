import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const RoomsList = ({ setCurrentRoom, rooms, setRooms }) => {
    useEffect(() => {
        fetch("http://localhost:3000/api/v0/get/rooms", { credentials: "include" })
            .then((res) => res.json())
            .then(({ statusCode, data, message }) => {
                if (statusCode === 200) {
                    console.log(message);

                    console.log(data[0].rooms);
                    setRooms(data[0].rooms);
                }
            });
    }, [])

    return (
        <div className="space-y-2">
            {rooms.map((room, index) => (
                <motion.div
                    onClick={() => {
                        setCurrentRoom({ name: room.name, avatar: room.avatar })
                    }}
                    key={room._id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition-colors flex items-center gap-x-5"
                >
                    <img src={`${room.avatar}`} alt="User Avatar" className="w-10 h-10 rounded-full border border-zinc-700" />
                    <p>{room.name}</p>
                </motion.div>
            ))}
        </div>
    );
};

export default RoomsList;