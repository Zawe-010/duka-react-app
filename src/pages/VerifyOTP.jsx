import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function VerifyOTP() {
    const navigate = useNavigate();
    const { userId } = useParams(); // get userId from URL
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const BACKEND_URL = "https://api.my-duka.co.ke";

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BACKEND_URL}/auth/verify-code/${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ otp }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "OTP verification failed");
            }

            navigate(`/reset-password/${userId}`);
        } catch (err) {
            setMessage(err.message);
        }
    };

    return (
        <div className="container mt-5">
            <h3>Verify OTP</h3>
            <form onSubmit={handleVerify}>
                <div className="mb-3">
                    <label>Enter OTP</label>
                    <input
                        type="text"
                        className="form-control"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                </div>
                <button className="btn btn-primary">Verify</button>
            </form>
            {message && <p className="mt-3 text-danger">{message}</p>}
        </div>
    );
}

export default VerifyOTP;
