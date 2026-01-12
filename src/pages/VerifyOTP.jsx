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
        if (!otp) {
            setMessage("OTP is required");
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const res = await fetch(`${BACKEND_URL}/auth/verify-code/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail);

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

            <input
                className="form-control mb-3"
                placeholder="Enter OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
            />

            <button className="btn btn-primary" onClick={handleVerifyOTP} disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {message && <p className="mt-3 text-danger">{message}</p>}
        </div>
    );
}

export default VerifyOTP;
