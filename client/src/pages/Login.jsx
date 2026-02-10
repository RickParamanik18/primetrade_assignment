import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const validate = ({ email, password }) => {
        if (!email || email.trim() === "") {
            alert("Email is required.");
            return false;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return false;
        }
        if (!password || password.trim() === "") {
            alert("Password is required.");
            return false;
        }
        if (password.length < 4) {
            alert("Password must be at least 4 characters.");
            return false;
        }
        return true;
    };

    const login = async () => {
        try {
            const isValidated = validate({ email, password });
            if (!isValidated) return;
            const res = await axios.post(
                `${import.meta.env.VITE_APP_SERVER_API_URL}/auth/login`,
                { email, password },
            );
            console.log(res);
            if (res.data.success) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("_id", res.data._id);
                localStorage.setItem("name", res.data.name);
                localStorage.setItem("email", res.data.email);
                navigate("/dashboard");
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        if (localStorage.getItem("token")) navigate("/dashboard");
    }, []);
    return (
        <div className="min-h-screen flex items-center justify-center from-indigo-50 to-purple-100">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Welcome Back
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Sign in to access your dashboard
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg outline-none
                         focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                         transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg outline-none
                         focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                         transition"
                        />
                    </div>

                    <button
                        onClick={login}
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg
                       font-semibold hover:bg-indigo-700 active:scale-[0.98]
                       transition-all duration-150 shadow-md"
                    >
                        Login
                    </button>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Don’t have an account?{" "}
                    <span
                        onClick={() => navigate("/register")}
                        className="text-indigo-600 font-medium cursor-pointer hover:underline"
                    >
                        Register
                    </span>
                </p>
            </div>
        </div>
    );
}
