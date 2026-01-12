import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [method, setMethod] = useState('email');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const BACKEND_URL = "https://api.my-duka.co.ke";

    const handleSendOTP = async () => {
        if (!email) {
            setMessage("Email is required");
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const res = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, method })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail);

            setMessage(data.message);
            navigate(`/verify-otp/${data.user_id}`);
        } catch (err) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Forgot Password</h2>

            <input
                type="email"
                className="form-control mb-3"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />

            <select
                className="form-select mb-3"
                value={method}
                onChange={e => setMethod(e.target.value)}
            >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
            </select>

            {method === "sms" && (
                <small className="text-warning">
                    SMS works only if your phone number exists.
                </small>
            )}

            <button className="btn btn-primary mt-3" onClick={handleSendOTP} disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
            </button>

            {message && <p className="mt-3">{message}</p>}
        </div>
    );
}

export default ForgotPassword;
