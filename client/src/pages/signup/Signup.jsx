import { useState, useRef } from "react";
import { ArrowRight, Lock, Unlock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import ToastProvider from "../../components/ToastProvider";
import { useDebouncedCallback } from 'use-debounce';
import { GoogleOAuthProvider } from '@react-oauth/google'
import GoogleAuth from "../../auth/Google";
import { Helmet } from "react-helmet-async";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState("/uploads/user.png");
    const [passwordType, setPasswordType] = useState("password");
    const [errorMessage, setErrorMessage] = useState(null)
    const passwordRef = useRef();

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(URL.createObjectURL(file));
            toast.success("Avatar updated successfully!", {
                style: { fontSize: "1rem" }
            });
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (username === "" || email === "" || password === "") {
            toast.error("Please fill in all fields", {
                duration: 4000,
                style: { backgroundColor: "#dc2626", color: "white", fontSize: "1rem" },
            });
            return;
        }

        const file = e.target[0].files[0]

        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('name', name);
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);

        fetch('http://localhost:3000/api/v0/signup', {
            method: 'POST',
            credentials: "include",
            body: formData
        })
            .then(res => res.json())
            .then(({ statusCode, message, redirectUrl }) => {
                if (statusCode == 200) {
                    toast.success(`${message} 🎉`, {
                        duration: 5000,
                        style: { backgroundColor: "#16a34a", color: "white", fontSize: "1rem" },
                    });
                    setTimeout(() => {
                        window.location.href = redirectUrl
                    }, 1000);
                }
                else {
                    toast.success(`${message} `, {
                        duration: 5000,
                        style: { backgroundColor: "#dc2626", color: "white", fontSize: "1rem" },
                    });
                }
            })
            .catch(err => {
                toast.dismiss(`Server Error`, {
                    duration: 5000,
                    style: { backgroundColor: "#dc2626", color: "white", fontSize: "1rem" },
                });
            })
    };

    const transitionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
    };

    const usernameCheck = useDebouncedCallback((username) => {
        if (!username) return;
        fetch('http://localhost:3000/api/v0/get/username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        })
            .then(res => res.json())
            .then(({ statusCode, message }) => {
                statusCode == 401 ? setErrorMessage(message) : setErrorMessage(null)
            })
    }, 300)


    const errorVariants = {
        initial: { opacity: 0, y: -5 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -5 }
    };

    return (
        <>
            <Helmet>
                <title>SignUp | WebChat</title>
            </Helmet>
            <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
                    <ToastProvider />
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={transitionVariants}
                        className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto"
                    >
                        <h1 className="text-white text-3xl sm:text-4xl font-bold mb-2 text-center">
                            Create an account
                        </h1>
                        <p className="text-gray-400 mb-8 text-center">Sign up to join @WebChat</p>

                        <form onSubmit={e => { handleSubmit(e, 'login') }} className="space-y-4" encType="multipart/form-data">
                            <div className="flex justify-center">
                                <label className="relative cursor-pointer">
                                    <input
                                        type="file"
                                        name='avatar'
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                    />
                                    <div className="w-32 h-32 rounded-full border-2 border-white flex items-center justify-center overflow-hidden bg-gray-700 hover:border-gray-300 transition-colors">
                                        <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                </label>
                            </div>
                            <div>
                                <input
                                    name="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Name"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <input
                                    name="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value)
                                        usernameCheck(e.target.value)
                                    }}
                                    placeholder="Username"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                                />
                                <AnimatePresence mode="wait">
                                    {errorMessage && (
                                        <motion.p
                                            variants={errorVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            className="text-red-500 pt-3 ml-3 overflow-hidden"
                                        >
                                            {errorMessage}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>
                            <div>
                                <input
                                    name="email"
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <div className="relative">
                                    <input
                                        name="password"
                                        ref={passwordRef}
                                        type={passwordType}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                                    />
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    >
                                        {passwordType === "password" ? (
                                            <Lock
                                                className="h-5 w-5 text-gray-500 cursor-pointer hover:text-white transition-colors"
                                                onClick={() => setPasswordType("text")}
                                            />
                                        ) : (
                                            <Unlock
                                                className="h-5 w-5 text-gray-500 cursor-pointer hover:text-white transition-colors"
                                                onClick={() => setPasswordType("password")}
                                            />
                                        )}
                                    </motion.div>
                                </div>
                            </div>
                            <div className="text-center mt-6">
                                <p className="text-gray-400">
                                    Already have an account?{" "}
                                    <Link
                                        to="/login"
                                        className="text-white hover:text-gray-200 transition-colors cursor-pointer font-medium"
                                    >
                                        Log in
                                    </Link>
                                </p>
                            </div>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full bg-white text-black py-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center group cursor-pointer font-medium"
                            >
                                Sign up
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                            <div className="w-max mx-auto">
                                <GoogleAuth />
                            </div>
                        </form>
                    </motion.div>
                </GoogleOAuthProvider>
            </div>
        </>
    );
};

export default Signup;