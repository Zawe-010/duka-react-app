import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { userId } = useParams();
    const navigate = useNavigate();

    const BACKEND_URL = "https://api.my-duka.co.ke";

    const handleReset = async () => {
        if (password.length < 6) {
            setMessage("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const res = await fetch(`${BACKEND_URL}/auth/reset-password/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ new_password: password })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail);

            setMessage("Password reset successful");
            setTimeout(() => navigate('/auth/login'), 1200);
        } catch (err) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Reset Password</h2>

            <input
                type="password"
                className="form-control mb-3"
                placeholder="New password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />

            <button className="btn btn-primary" onClick={handleReset} disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
            </button>

            {message && <p className="mt-3">{message}</p>}
        </div>
    );
}

export default ResetPassword;
