import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { UserCheck, UserMinus, UserPlus, Search } from 'lucide-react'
import { useCurrentRoom } from '../../../context/currentRoom';
import { toast } from 'sonner'
import { socket } from '../../../socket'


const RoomMembers = () => {
    const [currentRoom, setCurrentRoom] = useCurrentRoom()
    const [searchQuery, setSearchQuery] = useState('');
    const [members, setMembers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/api/v0/room/members", {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomId: currentRoom.roomId })
        })
            .then((res) => res.json())
            .then(({ statusCode, data, message }) => {
                if (statusCode === 200) {
                    const { members } = data[0]
                    console.log(members);

                    setMembers(members)
                }
            });
    }, [currentRoom])

    const filteredMembers = useMemo(() => {
        const query = searchQuery;
        return members
            .filter(member => {
                member.isFriend = false;
                return member.username.includes(query) || member.name.includes(query)
            }
            )
    }, [members, searchQuery]);


    const handleFriendAction = (memberId, isFriend) => {
        // const data = { memberId, isFriend }
        // socket.emit('friend', data)
    };


    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-72 bg-zinc-800 rounded-lg shadow-lg border border-zinc-700"
        >
            <div className="p-3 border-b border-zinc-700">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-900 text-white text-sm rounded-md px-8 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-600 placeholder-zinc-500"
                    />
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
                </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {filteredMembers.map((member) => (
                    <div
                        key={member.id}
                        className="p-3 hover:bg-zinc-700 transition-colors flex items-center justify-between group"
                    >
                        <div className="flex items-center space-x-3">
                            <img
                                src={member.avatar}
                                alt={member.name}
                                className="w-8 h-8 rounded-full border border-zinc-600"
                            />
                            <div className="flex items-center space-x-2">
                                <div>
                                    <p className="font-medium text-sm text-white">{member.name}</p>
                                    <p className="text-xs text-gray-400">@{member.username}</p>
                                </div>
                                {member.isFriend && (
                                    <div className="flex items-center">
                                        <span className="text-green-400">
                                            <UserCheck className="w-4 h-4" />
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => handleFriendAction(member.id, member.isFriend)}
                            className={`transition-all duration-200 ${member.isFriend
                                ? 'text-red-400 hover:text-red-500'
                                : 'text-gray-400 hover:text-green-400'
                                } opacity-0 group-hover:opacity-100 focus:opacity-100`}
                            title={member.isFriend ? 'Remove Friend' : 'Add Friend'}
                        >
                            {member.isFriend ? (
                                <UserMinus className="w-5 h-5" />
                            ) : (
                                <UserPlus className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}

export default RoomMembers
