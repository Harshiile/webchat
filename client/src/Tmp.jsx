import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Tmp = () => {
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    const checkUsername = async () => {
        // Simulating API call
        if (username === "existingUser") {
            setError("Oops! This username is already taken. Try another one. 🚀");
        } else {
            setError(""); // Clear error if valid
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-white text-xl font-semibold mb-4">Sign Up</h2>
                <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value)
                        checkUsername()
                    }
                    }
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-400 outline-none"
                />

                <AnimatePresence>
                    {error && (
                        <motion.p
                            className="text-red-400 text-sm mt-2"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                        >
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Tmp;
