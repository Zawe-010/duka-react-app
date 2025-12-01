function Navbar({ isLoggedIn }) {
    return (
        <>
            {/* Inline style for hover */}
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
                    <a className="navbar-brand" href="/">My-Duka</a>

                    {/* Hamburger button */}
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

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mx-auto">

                            <li className="nav-item"><a className="nav-link" href="/">Home</a></li>

                            {!isLoggedIn && (
                                <>
                                    <li className="nav-item"><a className="nav-link" href="/register">Register</a></li>
                                    <li className="nav-item"><a className="nav-link" href="/login">Login</a></li>
                                </>
                            )}

                            {isLoggedIn && (
                                <>
                                    <li className="nav-item"><a className="nav-link" href="/products">Products</a></li>
                                    <li className="nav-item"><a className="nav-link" href="/sales">Sales</a></li>
                                    <li className="nav-item"><a className="nav-link" href="/dashboard">Dashboard</a></li>
                                    <li className="nav-item"><a className="nav-link" href="/payments">Payments</a></li>
                                </>
                            )}
                        </ul>

                        {isLoggedIn && (
                            <button className="btn btn-danger">Logout</button>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
