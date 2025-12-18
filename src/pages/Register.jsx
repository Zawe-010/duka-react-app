import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Register() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("https://api.my-duka.co.ke/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name: fullName,
                    email,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Registration failed");

            // Save token exactly like login
            localStorage.setItem("token", data.token || data.access_token);

            setSuccess(true);
            setMessage("Registration successful!");

            // Directly navigate to dashboard
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setMessage(err.message);
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="RegisterPage d-flex flex-column min-vh-100">
            <Navbar isLoggedIn={false} />

            <main className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
                <div className="card shadow" style={{ width: "400px" }}>
                    <div className="card-body">
                        <h2 className="card-title mb-4 text-center">Register</h2>

                        <form onSubmit={handleRegister}>
                            <div className="mb-3">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                        Registering...
                                    </>
                                ) : (
                                    "Register"
                                )}
                            </button>
                        </form>

                        {message && (
                            <div
                                className={`mt-3 text-center ${success ? "text-success" : "text-danger"
                                    }`}
                            >
                                {message}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Register;
