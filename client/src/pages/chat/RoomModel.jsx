import { useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const RoomModal = ({ modalType, closeModal }) => {
    const [roomName, setRoomName] = useState("");
    const [roomType, setRoomType] = useState("public");
    const [roomLogo, setRoomLogo] = useState("/uploads/user.png");

    const handleRoomSubmit = (e) => {
        e.preventDefault();

        if (!roomName.trim()) {
            toast.error("Please enter a room name", {
                duration: 4000,
                style: { backgroundColor: "#dc2626", color: "white", fontSize: "1rem" },
            });
            return;
        }

        // Add your room creation/joining logic here
        console.log("Room details:", { roomName, roomType });
    };

    const transitionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
    };

    return (
        <>
            {/* Backdrop blur */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />

            {/* Modal */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={transitionVariants}
                className="fixed w-full max-w-lg mx-auto p-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 border border-white/20 rounded-xl shadow-[0_0_25px_rgba(255,255,255,0.1)] backdrop-blur-xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-white text-2xl sm:text-3xl font-bold">
                        {modalType === "create" ? "Create Room" : "Join Room"}
                    </h2>
                    <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <p className="text-gray-400 mb-8">
                    {modalType === "create"
                        ? "Create a new room to start chatting"
                        : "Join an existing room to connect"}
                </p>

                <form onSubmit={handleRoomSubmit} className="space-y-6">
                    {modalType === "create" && (
                        <>
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
                                <label className="text-white font-medium">Room Type</label>
                                <div className="grid gap-4">
                                    <label
                                        className={`flex items-center space-x-2 p-4 rounded-lg cursor-pointer transition-all duration-200 
                      ${roomType === 'public'
                                                ? 'bg-white/10 border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                                                : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        <div className="relative">
                                            <input
                                                type="radio"
                                                name="roomType"
                                                value="public"
                                                checked={roomType === "public"}
                                                onChange={(e) => setRoomType(e.target.value)}
                                                className="w-4 h-4 border-2 border-white rounded-full text-white focus:ring-2 focus:ring-white/50 transition-shadow"
                                            />
                                            <div className={`absolute inset-0 rounded-full ${roomType === 'public' ? 'shadow-[0_0_10px_rgba(255,255,255,0.5)]' : ''}`} />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <span className="text-white font-medium">Public Room</span>
                                            <p className="text-gray-400 text-sm">
                                                Anyone can find and join this room. It will be listed in the public directory.
                                            </p>
                                        </div>
                                    </label>
                                    <label
                                        className={`flex items-center space-x-2 p-4 rounded-lg cursor-pointer transition-all duration-200 
                      ${roomType === 'private'
                                                ? 'bg-white/10 border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                                                : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        <div className="relative">
                                            <input
                                                type="radio"
                                                name="roomType"
                                                value="private"
                                                checked={roomType === "private"}
                                                onChange={(e) => setRoomType(e.target.value)}
                                                className="w-4 h-4 border-2 border-white rounded-full text-white focus:ring-2 focus:ring-white/50 transition-shadow"
                                            />
                                            <div className={`absolute inset-0 rounded-full ${roomType === 'private' ? 'shadow-[0_0_10px_rgba(255,255,255,0.5)]' : ''}`} />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <span className="text-white font-medium">Private Room</span>
                                            <p className="text-gray-400 text-sm">
                                                Only people with the room link can join. The room won't be listed publicly.
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </>
                    )}

                    <div>
                        <input
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            placeholder="Room Name"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white text-black py-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center group space-x-2 font-medium"
                    >
                        <span>{modalType === "create" ? "Create Room" : "Join Room"}</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </motion.div>
        </>
    );
};

export default RoomModal;