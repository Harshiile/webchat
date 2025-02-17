import { motion } from "framer-motion";
const rooms = [
    { id: 1, name: "General" },
    { id: 2, name: "Random" },
    { id: 3, name: "Development" },
];

const RoomsList = ({ setCurrentRoom }) => {
    return (
        <div className="space-y-2">
            {rooms.map((room, index) => (
                <motion.div
                    onClick={() => {
                        setCurrentRoom(room.name)
                    }}
                    key={room.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition-colors flex items-center gap-x-5"
                >
                    <img src='/uploads/user.png' alt="User Avatar" className="w-10 h-10 rounded-full border border-zinc-700" />
                    <p>{room.name}</p>
                </motion.div>
            ))}
        </div>
    );
};

export default RoomsList;