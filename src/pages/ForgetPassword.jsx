import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ForgetPassword() {
    const navigate = useNavigate();
    const [method, setMethod] = useState("email"); // default method
    const [identifier, setIdentifier] = useState(""); // email or phone
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const BACKEND_URL = "https://api.my-duka.co.ke";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const payload = method === "email"
                ? { email: identifier, method }
                : { email: identifier, method }; // backend expects "email" field for both?

            // If your backend expects phone number separately:
            // payload = method === "sms" ? { phone: identifier, method } : { email: identifier, method };

            const res = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Failed to send OTP");
            }

            const data = await res.json();
            setMessage(`OTP sent via ${method.toUpperCase()}!`);
            navigate(`/verify-otp/${data.user_id}`);
        } catch (err) {
            console.error(err);
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
                    <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                        <h3 className="mb-4 text-center">Forgot Password</h3>

                        <div className="mb-3">
                            <label className="form-label">Send OTP via</label>
                            <div className="d-flex gap-3">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="method"
                                        value="email"
                                        checked={method === "email"}
                                        onChange={(e) => {
                                            setMethod(e.target.value);
                                            setIdentifier(""); // reset input
                                        }}
                                    />
                                    <label className="form-check-label">Email</label>
                                </div>

                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="method"
                                        value="sms"
                                        checked={method === "sms"}
                                        onChange={(e) => {
                                            setMethod(e.target.value);
                                            setIdentifier(""); // reset input
                                        }}
                                    />
                                    <label className="form-check-label">SMS</label>
                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">{method === "email" ? "Email" : "Phone Number"}</label>
                            <input
                                type={method === "email" ? "email" : "tel"}
                                className="form-control"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                placeholder={method === "email" ? "Enter your email" : "Enter your phone number"}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>

                        {message && <div className="mt-3 text-center text-success">{message}</div>}
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ForgetPassword;
