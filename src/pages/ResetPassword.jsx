import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { userId } = useParams();
    const navigate = useNavigate();
    const BACKEND_URL = "https://api.my-duka.co.ke";

    const handleResetPassword = async () => {
        setMessage('');
        setLoading(true);

        try {
            const res = await fetch(`${BACKEND_URL}/auth/reset-password/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ new_password: newPassword })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.detail || 'Failed to reset password');

            setMessage(data.message);

            setTimeout(() => {
                navigate('/auth/login');
            }, 1000); // redirect after 1 sec
        } catch (err) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Reset Password</h2>

            <div className="mb-3">
                <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="form-control"
                />
            </div>

            <button
                className="btn btn-primary"
                onClick={handleResetPassword}
                disabled={loading}
            >
                {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            {message && <p className={`mt-3 ${message.includes('Failed') ? 'text-danger' : 'text-success'}`}>{message}</p>}
        </div>
    );
}

export default ResetPassword;
