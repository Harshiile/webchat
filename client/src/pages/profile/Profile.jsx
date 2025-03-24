import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BellRing, MessageCircle, LogOut, Edit2, X, Check, User } from "lucide-react";
import { toast } from "sonner";
import ToastProvider from '../../components/ToastProvider'
import EditProfileDialog from "../../components/EditProfileDialog";
import { useRooms } from "../../context/rooms";
import { useCurrentRoom } from "../../context/currentRoom";
import { socket } from "../../socket";
import { Helmet } from "react-helmet-async";
import logo from '/logo.png'

const Profile = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState({
        avatar: "",
        name: "",
        username: ""
    });
    const [rooms, setRooms] = useRooms()
    const [currentRoom, setCurrentRoom] = useCurrentRoom()

    useEffect(() => {
        fetch("http://localhost:3000/api/v0/get/rooms", { credentials: "include" })
            .then((res) => res.json())
            .then(({ statusCode, data, message }) => {
                if (statusCode === 200) {
                    const rooms = data[0].rooms
                    setRooms(rooms)
                }
            });
    }, [])
    useEffect(() => {
        socket.on('friend-request', data => console.log(data))
    }, [])

    useEffect(() => {
        fetch('http://localhost:3000/api/v0/get/user', {
            credentials: "include"
        })
            .then(res => res.json())
            .then(({ statusCode, data }) => {
                if (statusCode == 200) {
                    setUser({
                        username: data.user.username,
                        name: data.user.name,
                        avatar: data.user.avatar
                    })
                }
            })
    }, [])

    // Dummy notifications data
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'friend_request', from: 'Alice Smith', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80' },
        { id: 2, type: 'message', from: 'Bob Johnson', content: 'Hey, want to join our gaming session?', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80' }
    ]);

    const [showNotifications, setShowNotifications] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);

    const handleFriendRequest = (id, accept) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        const notification = notifications.find(n => n.id === id);
        if (accept) {
            toast.success(`You are now friends with ${notification?.from}!`);
        }
    };

    const handleProfileUpdate = (newData) => {
        setUser(newData);
        setShowEditDialog(false);
        // window.location.reload()
    };

    const logoutHandler = () => {
        fetch('http://localhost:3000/api/v0/logout', {
            method: 'POST',
            credentials: "include"
        }).then(res => res.json()).then(({ redirectUrl, statusCode }) => {
            if (statusCode == 200) {
                navigate(redirectUrl)
            }
            else {
                toast.error("Server Error", {
                    duration: 4000,
                    style: { backgroundColor: "#dc2626", color: "white", fontSize: "1rem" },
                });
            }
        })
    }
    return (
        <>
            <Helmet>
                <title>Profile | WebChat</title>
                <link rel="icon" type="image/png" href={logo} />
            </Helmet>
            <div className="min-h-screen flex flex-col items-center bg-black text-white">
                <ToastProvider />
                <EditProfileDialog
                    isOpen={showEditDialog}
                    onClose={() => setShowEditDialog(false)}
                    onSave={handleProfileUpdate}
                    currentData={user}
                />

                <section className="w-full h-screen flex flex-col relative bg-zinc-900/50">
                    <div className="flex justify-between mb-8  px-6 py-4 ">
                        <img src={logo} className="w-13 h-13" />
                        <div className="flex items-center gap-4 px-4">
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative group"
                                >
                                    <BellRing className={`w-6 h-6 cursor-pointer mt-2 text-white ${notifications.length > 0 ? 'animate-pulse' : ''}`} />
                                    {notifications.length > 0 && (
                                        <div className="absolute -top-1 -right-1 mt-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs">
                                            {notifications.length}
                                        </div>
                                    )}
                                </button>

                                {/* Notifications Panel */}
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 bg-zinc-800 rounded-lg shadow-lg overflow-hidden z-50">
                                        <div className="p-3 border-b border-zinc-700">
                                            <h3 className="font-semibold">Notifications</h3>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-4 text-center text-zinc-400">
                                                    No new notifications
                                                </div>
                                            ) : (
                                                notifications.map(notification => (
                                                    <div key={notification.id} className="p-3 border-b border-zinc-700 hover:bg-zinc-700/50 transition-colors">
                                                        <div className="flex items-start gap-3">
                                                            <img
                                                                src={notification.avatar}
                                                                alt={notification.from}
                                                                className="w-10 h-10 rounded-full object-cover"
                                                            />
                                                            <div className="flex-1">
                                                                <p className="font-semibold">{notification.from}</p>
                                                                {notification.type === 'friend_request' ? (
                                                                    <>
                                                                        <p className="text-sm text-zinc-400">Sent you a friend request</p>
                                                                        <div className="flex gap-2">
                                                                            <button
                                                                                onClick={() => handleFriendRequest(notification.id, true)}
                                                                                className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded-md flex items-center gap-1 text-sm"
                                                                            >
                                                                                <Check className="w-4 h-4" />
                                                                                Accept
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleFriendRequest(notification.id, false)}
                                                                                className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded-md flex items-center gap-1 text-sm"
                                                                            >
                                                                                <X className="w-4 h-4" />
                                                                                Decline
                                                                            </button>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <p className="text-sm text-zinc-400">{notification.content}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setShowEditDialog(true)}
                                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
                            >
                                <Edit2 className="w-4 h-4" />
                                <span>Edit Profile</span>
                            </button>
                        </div>
                    </div>
                    {/* Profile Info */}
                    <div className="flex flex-col justify-center md:flex-row gap-x-8 p-4 items-center md:items-center">
                        <div className="relative group">
                            <img
                                className="w-24 h-24 md:w-32 md:h-32 border-2 border-zinc-700 object-cover rounded-full transition-transform duration-300 group-hover:scale-105"
                                src={user.avatar}
                                alt="User Avatar"
                            />
                        </div>
                        <div className="flex flex-col items-center md:items-start">
                            <h2 className="font-bold text-2xl md:text-3xl">{user.name}</h2>
                            <p className="font-semibold text-zinc-400 mt-2">@{user.username}</p>
                        </div>
                    </div>

                    {/* Live Rooms Section */}
                    <div className="flex-1 overflow-hidden p-4 md:p-8">
                        <h2 className="font-bold text-2xl md:text-3xl mb-6">Live Rooms</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[calc(100%-3rem)] overflow-y-auto p-2">
                            {rooms.map((room, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setCurrentRoom({
                                            name: room.name,
                                            avatar: room.avatar,
                                            isPrivate: room.isPrivate,
                                            roomId: room.roomId
                                        })
                                        window.location.href = `/chat`
                                    }}
                                    className="group relative"
                                >
                                    <div className="bg-zinc-800/50 hover:bg-zinc-700/50 transition-all duration-200 rounded-xl p-4 flex items-center justify-between border border-zinc-700/50">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-xl capitalize">{room.name}</span>
                                            <div className="flex items-center gap-1 text-zinc-400 text-sm mt-1">
                                                <User className="w-4 h-4" />
                                                <span>{room.members.length} members</span>
                                            </div>
                                        </div>
                                        <div>
                                            <img className='rounded-full w-14 h-14' src={room.avatar} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Buttons */}
                    <div className="flex justify-center gap-4 mt-4 p-4">
                        <Link
                            to='/chat'
                            className="flex items-center gap-2 cursor-pointer bg-zinc-800 hover:bg-zinc-700 py-2 px-6 font-bold text-lg rounded-xl transition-colors duration-200">
                            <MessageCircle className="w-5 h-5" />
                            <span>Chat</span>
                        </Link>
                        <button
                            onClick={logoutHandler}
                            className="flex items-center gap-2 cursor-pointer hover:bg-red-700 py-2 px-6 font-bold text-lg rounded-xl transition-colors duration-200 bg-red-500">
                            <LogOut className="w-5 h-5" />
                            <span>Log Out</span>
                        </button>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Profile;







