import { Link } from "react-router-dom";

function Navbar() {
    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login"; // Redirect to login page after logout
    };

    return (
        <>
            {/* Inline CSS for hover styles */}
            <style>
                {`
                    .navbar-nav .nav-link {
                        font-weight: bold;
                        color: white !important;
                    }
                    .navbar-nav .nav-link:hover,
                    .navbar-brand:hover {
                        color: black !important;
                    }
                    .navbar-brand {
                        font-weight: bold;
                        color: white !important;
                    }
                `}
            </style>

            <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#6f42c1' }}>
                <div className="container-fluid">
                    {/* Brand */}
                    <span className="navbar-brand">My-Duka</span>

                    {/* Hamburger button for mobile */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Navbar links */}
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mx-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>

                            {!isLoggedIn && (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/register">Register</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login">Login</Link>
                                    </li>
                                </>
                            )}

                            {isLoggedIn && (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/products">Products</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/sales">Sales</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/dashboard">Dashboard</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/payments">Payments</Link>
                                    </li>
                                </>
                            )}
                        </ul>

                        {isLoggedIn && (
                            <button className="btn btn-danger" onClick={handleLogout}>
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
