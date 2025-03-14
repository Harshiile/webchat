import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { toast } from "sonner";
const GoogleAuth = () => {
    return (
        <div>
            <GoogleLogin
                onSuccess={async ({ credential }) => {
                    const { email, name, sub, picture } = jwtDecode(credential)
                    const data = {
                        avatar: picture,
                        name,
                        username: email.split('@')[0],
                        email,
                        password: sub
                    }
                    console.log(data);
                    fetch('http://localhost:3000/api/v0/auth/google', {
                        method: 'POST',
                        credentials: "include",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ data })
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
                        })
                        .catch(err => {
                            toast.dismiss(`Server Error`, {
                                duration: 5000,
                                style: { backgroundColor: "#dc2626", color: "white", fontSize: "1rem" },
                            });
                        })
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
            />
        </div>
    )
}

export default GoogleAuth
