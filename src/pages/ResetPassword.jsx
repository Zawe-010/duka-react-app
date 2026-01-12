// src/pages/ResetPassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const BACKEND_URL = "https://api.my-duka.co.ke";

    const handleReset = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        try {
            const res = await fetch(`${BACKEND_URL}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Reset failed");
            }

            setMessage("Password reset successful!");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setMessage(err.message);
        }
    };

    return (
        <div className="container mt-5">
            <h3>Reset Password</h3>
            <form onSubmit={handleReset}>
                <div className="mb-3">
                    <label>New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                </div>
                <div className="mb-3">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button className="btn btn-primary">Reset Password</button>
            </form>
            {message && <p className="mt-3 text-success">{message}</p>}
        </div>
    );
}

export default ResetPassword;
