import { X } from "lucide-react";
import { motion } from "framer-motion";


const Modal = ({ title, description, children, closeModal }) => {
    const transitionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
            <motion.div
                initial="hidden"
                animate="visible"
                variants={transitionVariants}
                className="fixed w-full max-w-lg mx-auto p-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 border border-white/20 rounded-xl shadow-[0_0_25px_rgba(255,255,255,0.1)] backdrop-blur-xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-white text-2xl sm:text-3xl font-bold">{title}</h2>
                    <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <p className="text-gray-400 mb-8">{description}</p>
                {children}
            </motion.div>
        </>
    );
};

export default Modal;