import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const validate = ({ email, password, name }) => {
        if (name !== undefined && name.trim() === "") {
            alert("Name is required.");
            return false;
        }

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

    const register = async () => {
        try {
            const isValidated = validate({ email, password, name });
            if (!isValidated) return;
            const res = await axios.post(
                `${import.meta.env.VITE_APP_SERVER_API_URL}/auth/register`,
                { email, password, name },
            );
            console.log(res);
            if (res.data.success) {
                navigate("/login");
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
                        Welcome
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Register to access your dashboard
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            placeholder="Eg: Rick "
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg outline-none
                         focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                         transition"
                        />
                    </div>

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
                        onClick={register}
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg
                       font-semibold hover:bg-indigo-700 active:scale-[0.98]
                       transition-all duration-150 shadow-md"
                    >
                        Register
                    </button>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Have an account?{" "}
                    <span
                        onClick={() => navigate("\login")}
                        className="text-indigo-600 font-medium cursor-pointer hover:underline"
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
}
