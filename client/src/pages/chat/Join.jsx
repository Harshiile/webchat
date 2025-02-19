import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Modal from "./Model";


const JoinRoom = ({ closeModal }) => {
    const [roomName, setRoomName] = useState("");

    const handleRoomSubmit = (e) => {
        e.preventDefault();

        if (!roomName.trim()) {
            toast.error("Please enter a room name", {
                duration: 4000,
                style: { backgroundColor: "#dc2626", color: "white", fontSize: "1rem" },
            });
            return;
        }

        console.log("Joining room:", { roomName });
    };

    return (
        <Modal
            title="Join Room"
            description="Join an existing room to connect"
            closeModal={closeModal}
        >
            <form onSubmit={handleRoomSubmit} className="space-y-6">
                <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Room Name"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                />

                <button
                    type="submit"
                    className="w-full bg-white text-black py-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center group space-x-2 font-medium"
                >
                    <span>Join Room</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </form>
        </Modal>
    );
};

export default JoinRoom;