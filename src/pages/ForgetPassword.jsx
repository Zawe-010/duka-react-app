// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const BACKEND_URL = "https://api.my-duka.co.ke";

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Request failed");
            }

            setMessage("OTP sent! Check your email.");
            setTimeout(() => navigate("/verify-otp"), 2000);
        } catch (err) {
            setMessage(err.message);
        }
    };

    return (
        <div className="container mt-5">
            <h3>Forgot Password</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button className="btn btn-primary">Send OTP</button>
            </form>
            {message && <p className="mt-3 text-success">{message}</p>}
        </div>
    );
}

export default ForgotPassword;
