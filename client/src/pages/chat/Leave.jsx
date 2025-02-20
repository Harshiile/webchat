import { motion, AnimatePresence } from "framer-motion";


const LeaveRoomDialog = ({ setLeaveRoomShow, setRoomLeavedConfirm }) => {
    if (!open) return null;

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLeaveRoomShow(false)}
                        className="fixed inset-0 bg-black/60 z-50"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ type: "spring", duration: 0.3 }}
                        className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-xl"
                    >
                        <div className="flex flex-col space-y-4">
                            <div className="text-center sm:text-left">
                                <h2 className="text-xl font-semibold text-white mb-2">Leave Room</h2>
                                <p className="text-gray-400">
                                    Are you sure you want to leave this room? You'll need to rejoin to see new messages.
                                </p>
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
                                <button
                                    onClick={() => setLeaveRoomShow(false)}
                                    className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors duration-200"
                                >
                                    No, stay
                                </button>
                                <button
                                    onClick={() => {
                                        setLeaveRoomShow(false)
                                        setRoomLeavedConfirm(true)
                                    }}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                                >
                                    Yes, leave room
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default LeaveRoomDialog;