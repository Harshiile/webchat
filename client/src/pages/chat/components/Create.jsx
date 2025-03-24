import { useState } from "react";
import { ArrowRight, Globe2, Lock } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Modal from "./Model";
import { socket } from "../../../socket";
import { useRooms } from "../../../context/rooms";
import { useCurrentRoom } from "../../../context/currentRoom";

const CreateRoom = ({ closeModal }) => {
    const [name, setName] = useState("");
    const [, setCurrentRoom] = useCurrentRoom()
    const [, setRooms] = useRooms()
    const [roomType, setRoomType] = useState("public");
    const [roomLogo, setRoomLogo] = useState("/uploads/user.png");
    const handleRoomSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Please enter a room name", {
                duration: 4000,
                style: { backgroundColor: "#dc2626", color: "white", fontSize: "1rem" },
            });
            return;
        }

        const file = e.target[0].files[0]

        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('isPrivate', roomType == 'private');
        formData.append('name', name);

        fetch('http://localhost:3000/api/v0/room/create', {
            method: 'POST',
            credentials: "include",
            body: formData
        }).then(res => res.json()).then(({ statusCode, message, data }) => {
            if (statusCode == 200) {
                closeModal()
                setRooms((rooms) => [...rooms, data[0]])
                setCurrentRoom(data[0])
                socket.emit('room-create', { roomId: data[0].roomId })
                toast.success(`${message} 🎉`, {
                    duration: 5000,
                    style: { backgroundColor: "#16a34a", color: "white", fontSize: "1rem" },
                });
            }
        })
    };

    return (
        <Modal
            title="Create Room"
            description="Create a new room to start chatting"
            closeModal={closeModal}
        >
            <form onSubmit={handleRoomSubmit} className="space-y-6">
                <div className="flex justify-center">
                    <label className="relative cursor-pointer">
                        <input
                            type="file"
                            name="avatar"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setRoomLogo(URL.createObjectURL(file));
                                }
                            }}
                        />
                        <div className="w-32 h-32 rounded-full border-2 border-white/40 flex items-center justify-center overflow-hidden bg-gray-700/50 hover:border-white transition-colors shadow-lg">
                            <img src={roomLogo} alt="Room Logo" className="w-full h-full object-cover" />
                        </div>
                    </label>
                </div>

                <div className="space-y-4">
                    <label className="text-white font-mediu">Room Type</label>
                    <div className="grid gap-4 mt-3">
                        {[
                            {
                                type: "public",
                                icon: <Globe2 className="w-5 h-5" />,
                                title: "Public Room",
                                description: "Anyone can find and join this room. It will be listed in the public directory.",
                            },
                            {
                                type: "private",
                                icon: <Lock className="w-5 h-5" />,
                                title: "Private Room",
                                description: "Only people with the room link can join. The room won't be listed publicly.",
                            },
                        ].map(({ type, icon, title, description }) => (
                            <motion.label
                                key={type}
                                className={`relative flex items-center space-x-3 p-4 rounded-xl cursor-pointer transition-all duration-300 
                  ${roomType === type
                                        ? "bg-white/10 border-2 border-white shadow-[0_0_25px_rgba(255,255,255,0.1)]"
                                        : "bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20"
                                    }`}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <div className="relative flex-shrink-0">
                                    <input
                                        type="radio"
                                        name="roomType"
                                        value={type}
                                        checked={roomType === type}
                                        onChange={(e) => setRoomType(e.target.value)}
                                        className="sr-only"
                                    />
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${roomType === type
                                            ? "border-white bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                            : "border-white/40 bg-transparent"
                                            }`}
                                    >
                                        {roomType === type && (
                                            <motion.div
                                                className="absolute inset-0 flex items-center justify-center text-black"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            >
                                                {icon}
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-grow grid gap-1">
                                    <span className={`font-medium transition-colors duration-200 ${roomType === type ? "text-white" : "text-white/80"
                                        }`}>{title}</span>
                                    <p className="text-gray-400 text-sm">{description}</p>
                                </div>
                                {roomType === type && (
                                    <motion.div
                                        className="absolute inset-0 border-2 border-white/20 rounded-xl pointer-events-none"
                                        layoutId="roomTypeOutline"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </motion.label>
                        ))}
                    </div>
                </div>

                <input
                    type="text"
                    name="roomName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Room Name"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                />

                <button
                    type="submit"
                    className="w-full bg-white text-black py-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center group space-x-2 font-medium"
                >
                    <span>Create Room</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </form>
        </Modal>
    );
};

export default CreateRoom;