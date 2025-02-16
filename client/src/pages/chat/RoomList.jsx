import { motion } from "framer-motion";

const rooms = [
    { id: 1, name: "General" },
    { id: 2, name: "Random" },
    { id: 3, name: "Development" },
];

const RoomsList = () => {
    return (
        <div className="space-y-2">
            {rooms.map((room, index) => (
                <motion.div
                    key={room.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition-colors"
                >
                    {room.name}
                </motion.div>
            ))}
        </div>
    );
};

export default RoomsList;