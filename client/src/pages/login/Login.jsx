import { useState, useRef } from "react";
import { ArrowRight, Lock, Unlock } from "lucide-react";
import { motion } from 'framer-motion'
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google'
import ToastProvider from "../../components/ToastProvider";
import GoogleAuth from "../../auth/Google";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordType, setPasswordType] = useState('password')
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please fill email", {
                duration: 4000,
                style: { backgroundColor: "#dc2626", color: "white", fontSize: "1rem" },
            });
            return;
        }
        if (!password) {
            toast.error("Please fill password", {
                duration: 4000,
                style: { backgroundColor: "#dc2626", color: "white", fontSize: "1rem" },
            });
            return;
        }

        fetch('http://localhost:3000/api/v0/login', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json())
            .then(({ statusCode, message, redirectUrl }) => {
                if (statusCode == 200) {
                    toast.success(`${message} 🎉`, {
                        duration: 5000,
                        style: { backgroundColor: "#16a34a", color: "white", fontSize: "1rem" },
                    });
                    window.location.href = redirectUrl
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
    return (
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
                        Welcome back
                    </h1>
                    <p className="text-gray-400 mb-8 text-center">
                        Sign in to continue @WebChat
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                name='email'
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
                                    name='password'
                                    ref={passwordRef}
                                    type={passwordType}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                                />
                                {
                                    passwordType === "password" ?
                                        <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 cursor-pointer hover:text-white transition-colors" onClick={() => { setPasswordType('text') }} />
                                        :
                                        <Unlock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 cursor-pointer hover:text-white transition-colors" onClick={() => { setPasswordType('password') }} />
                                }
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-white text-black py-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center group cursor-pointer font-medium"
                        >
                            Sign in
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="text-center mt-4">
                            <button className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer">
                                Forgot your password?
                            </button>
                        </div>

                        <div className="text-center mt-6">
                            <p className="text-gray-400">
                                Don't have an account?{" "}
                                <Link
                                    to="/signup"
                                    className="text-white hover:text-gray-200 transition-colors cursor-pointer font-medium"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                        <GoogleAuth />
                    </form>
                </motion.div>
            </GoogleOAuthProvider>
        </div>

    );
};

export default Login;