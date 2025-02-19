import { motion } from "framer-motion";


const MessageBubble = ({ text, sender, timestamp }) => {
    return (
        <div
            className={`max-w-[80%] p-3 rounded-lg ${sender === "user"
                ? "bg-indigo-600 text-white rounded-br-none"
                : "bg-zinc-800 text-gray-100 rounded-bl-none"
                }`}
        >
            <p>{text}</p>
            <span className="text-xs opacity-70 mt-1 block">
                {timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </span>
        </div>
    );
};

export default MessageBubble;