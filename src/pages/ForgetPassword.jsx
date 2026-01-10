import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [method, setMethod] = useState('email'); // 'email' or 'sms'
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const BACKEND_URL = "https://api.my-duka.co.ke";

    const handleSendOTP = async () => {
        setMessage('');
        setLoading(true);

        try {
            const res = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, method })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.detail || 'Failed to send OTP');

            setMessage(data.message);

            if (data.user_id) {
                navigate(`/verify-otp/${data.user_id}`);
            }
        } catch (err) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Forgot Password</h2>

            <div className="mb-3">
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="form-control"
                />
            </div>

            <div className="mb-3">
                <label>Send OTP via:</label>
                <select
                    className="form-select"
                    value={method}
                    onChange={e => setMethod(e.target.value)}
                >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                </select>
            </div>

            <button
                className="btn btn-primary"
                onClick={handleSendOTP}
                disabled={loading}
            >
                {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>

            {message && <p className={`mt-3 ${message.includes('Failed') ? 'text-danger' : 'text-success'}`}>{message}</p>}
        </div>
    );
}

export default ForgotPassword;
