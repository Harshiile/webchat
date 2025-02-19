import { motion } from "framer-motion";


const MessageBubble = ({ text, sender, senderName, timestamp, avatarUrl }) => {
    return (
        <div className={`flex items-center gap-3 max-w-[75%] ${sender === "user" ? "self-end flex-row-reverse" : "self-start flex-row"}`}>
            {/* Avatar (Only for non-user messages) */}
            {sender !== "user" && (
                <img src={avatarUrl} className="w-10 h-10 rounded-full border border-gray-600 shadow-sm" />
            )}

            {/* Message Bubble */}
            <div className="flex flex-col">
                {/* Sender Name (Only for received messages) */}
                {sender !== "user" && (
                    <span className="text-xs text-gray-200 pl-2 mb-0.5">{senderName}</span>
                )}

                {/* Message Content */}
                <div className={`relative px-4 py-2 text-sm w-fit max-w-full break-words shadow-md 
                ${sender === "user"
                        ? "bg-indigo-600 text-white rounded-2xl rounded-br-sm"
                        : "bg-gray-800 text-gray-100 rounded-2xl rounded-bl-sm"
                    }`}>
                    <p className="text-[16px]">{text}</p>
                </div>

                {/* Timestamp (Aligns right for sent messages) */}
                <span className={`text-xs text-gray-500 mt-1 ${sender === "user" ? "text-right" : "text-left"}`}>
                    {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </div>

    );
};

export default MessageBubble;