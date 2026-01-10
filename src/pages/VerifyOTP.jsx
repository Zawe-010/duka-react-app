import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function VerifyOTP() {
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { userId } = useParams();
    const navigate = useNavigate();
    const BACKEND_URL = "https://api.my-duka.co.ke";

    const handleVerifyOTP = async () => {
        setMessage('');
        setLoading(true);

        try {
            const res = await fetch(`${BACKEND_URL}/auth/verify-code/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.detail || 'Invalid OTP');

            setMessage(data.message);

            navigate(`/reset-password/${userId}`);
        } catch (err) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Verify OTP</h2>

            <div className="mb-3">
                <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="form-control"
                />
            </div>

            <button
                className="btn btn-primary"
                onClick={handleVerifyOTP}
                disabled={loading}
            >
                {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            {message && <p className={`mt-3 ${message.includes('Invalid') ? 'text-danger' : 'text-success'}`}>{message}</p>}
        </div>
    );
}

export default VerifyOTP;
