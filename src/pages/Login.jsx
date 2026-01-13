// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const BACKEND_URL = "https://api.my-duka.co.ke";

    // Redirect if already logged in
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        // if (token) navigate("/dashboard");
    }, []); // run only once

    const loginUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        console.log("email-------", email)
        console.log("password-----", password)
        console.log("access_token----", "access_token")

        try {
            const res = await fetch(`${BACKEND_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Login failed");
            }

            const data = await res.json();
            localStorage.setItem("access_token", data.access_token);
            // navigate("/dashboard");
        } catch (err) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container d-flex justify-content-center align-items-center flex-grow-1">
                <div className="w-100" style={{ maxWidth: "400px" }}>
                    <form onSubmit={loginUser} className="card p-4 shadow-sm">
                        <h3 className="mb-4 text-center">Login</h3>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>
                        {message && <div className="mt-3 text-center text-danger">{message}</div>}
                    </form>

                    <div className="mt-2 text-center">
                        <button
                            className="btn btn-link"
                            onClick={() => navigate("/forgot-password")}
                        >
                            Forgot Password?
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Login;
