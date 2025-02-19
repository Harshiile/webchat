import { useState, useEffect, useRef } from "react";
import { MessageSquare, Plus, Users, User, Users2, LogOut, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import RoomsList from "./RoomList";
import { Link } from "react-router-dom";
import CreateRoom from "./Create";
import JoinRoom from "./Join";
import MessageBubble from "./MessageBubble";

const Chat = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [currentRoom, setCurrentRoom] = useState({ name: "General", avatar: 'rooms/user.png' });
    const [showSidebar, setShowSidebar] = useState(true);
    const [hovered, setHovered] = useState(false);
    const [user, setUser] = useState({ name: "", avatar: "" });
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(""); // "create" or "join"
    const [roomData, setRoomData] = useState({ name: "", description: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rooms, setRooms] = useState([])

    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        fetch("http://localhost:3000/api/v0/get/user", { credentials: "include" })
            .then((res) => res.json())
            .then(({ statusCode, data }) => {
                if (statusCode === 200) {
                    setUser({
                        name: data.user.name,
                        avatar: `/uploads/${data.user.avatar}`,
                    });
                }
            });
    }, []);

    const openModal = (type) => {
        setModalType(type);
        setRoomData({ name: "", description: "" });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleRoomSubmit = () => {
        toast.success(`${modalType === "create" ? "Room created!" : "Joined room!"}`);
        closeModal();
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!message.trim()) return;

        const newMessage = {
            id: Date.now().toString(),
            text: message,
            sender: "user",
            timestamp: new Date(),
            senderName: "Mcintyre",
            avatarUrl: "/uploads/user.png"
        };

        setMessages((prev) => [...prev, newMessage]);
        setMessage("");
    };
    return (
        <div className="h-screen w-screen text-white flex flex-col bg-black overflow-hidden">
            {/* Navbar */}
            <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-zinc-900 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <MessageSquare className="w-6 h-6" />
                    <span className="text-xl font-bold">ChatApp</span>
                </div>

                {/* User Avatar with Hover Effect */}
                <Link className="relative flex items-center space-x-2 cursor-pointer" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} to="/profile">
                    <motion.div animate={{ x: hovered ? -10 : 0 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="flex items-center">
                        <motion.span animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 10 }} transition={{ duration: 0.3 }} className="w-max bg-zinc-800 px-3 py-1 rounded-lg text-md text-gray-300 shadow-lg absolute right-12 mt-1">
                            {user.name}
                        </motion.span>
                        <img src={user.avatar} alt="User Avatar" className="w-10 h-10 rounded-full border border-zinc-700" />
                    </motion.div>
                </Link>
            </motion.nav>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Rooms Sidebar */}
                <motion.div initial={{ x: -250 }} animate={{ x: showSidebar ? 0 : -250 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className={`w-1/6 bg-zinc-900 border-r border-zinc-800 absolute md:relative h-full z-10 ${showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
                    <div className="p-4">
                        <div className="space-y-3 mb-6">
                            <button onClick={() => openModal("create")} className="w-full flex items-center justify-center space-x-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition-colors text-white">
                                <Plus className="w-4 h-4" />
                                <span>Create Room</span>
                            </button>
                            <button onClick={() => openModal("join")} className="w-full flex items-center justify-center space-x-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition-colors text-white">
                                <Users className="w-4 h-4" />
                                <span>Join Room</span>
                            </button>
                        </div>
                        <div className="flex items-center mb-4 justify-between px-3">
                            <h2 className="text-lg font-semibold text-gray-300">Rooms</h2>
                            <Users2 className="w-4 h-4" />
                        </div>
                        <RoomsList setCurrentRoom={setCurrentRoom} rooms={rooms} setRooms={setRooms} />
                    </div>
                </motion.div>

                {/* Chat Section */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex-1 flex flex-col bg-zinc-950">
                    <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
                        <div className="flex items-center gap-x-3.5">
                            <img src={currentRoom.avatar} className="w-10 h-10 rounded-full border border-gray-600 shadow-sm" />
                            <h3 className="text-lg font-semibold">{currentRoom.name}</h3>
                        </div>
                        <button onClick={() => toast.info("Leaving room...")} className="flex items-center space-x-2 text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-red-400/10 transition-colors">
                            <LogOut className="w-4 h-4" />
                            <span>Leave Room</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6">
                        {/* Messages will be added here */}
                        <AnimatePresence initial={false}>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ x: msg.sender === "user" ? 100 : -100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <MessageBubble
                                        text={msg.text}
                                        sender={msg.sender}
                                        timestamp={msg.timestamp}
                                        senderName={msg.senderName}
                                        avatarUrl={msg.avatarUrl}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                    </div>

                    <motion.form initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} onSubmit={handleSubmit} className="px-6 py-4 border-t border-zinc-800 bg-zinc-900">
                        <div className="flex space-x-4">
                            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100 placeholder-gray-400" />
                            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
                                <Send className="w-4 h-4" />
                                <span>Send</span>
                            </button>
                        </div>
                    </motion.form>
                </motion.div>
            </div>

            {/* Modal Dialog for Creating/Joining Room */}
            <AnimatePresence>
                {isModalOpen && (
                    modalType == 'create' ?
                        <CreateRoom
                            closeModal={closeModal}
                            setCurrentRoom={setCurrentRoom}
                            setRooms={setRooms}
                        /> :
                        <JoinRoom closeModal={closeModal} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Chat;
