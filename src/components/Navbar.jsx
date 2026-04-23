import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { event } from "jquery";


function Navbar() {
    const[isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("access_token")
            setIsLoggedIn(!!token)
        }
        checkAuth()
        window.addEventListener("authChange", checkAuth)
        return () => window.removeEventListener("authChange", checkAuth)
    }, [])

    // const token = localStorage.getItem("access_token");


    const handleLogout = () => {
        localStorage.removeItem("token");
        window.dispatchEvent(new event("authChange")) 
        navigate ("/login")
    };

    const publicLinks = [
        {to:"/", label:"Home"},
        {to:"/register", label:"Register"},
        {to:"/login", label:"Login"}
    ];

    const privateLinks = [
        { to: "/", label: "Home" },
        { to: "/products", label: "Products" },
        { to: "/sales", label: "Sales" },
        { to: "/dashboard", label: "Dashboard" },
        { to: "/payments", label: "Payments" },
    ];

    const links = isLoggedIn ? privateLinks:publicLinks

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
                            {links.map((link) => (
                                <li className="nav-item" key={link.to}>
                                    <NavLink
                                        to={link.to}
                                        className={({ isActive }) =>
                                            `nav-link fw-semibold ${isActive ? "text-dark rounded px-2" : ""
                                            }`
                                        }
                                    >
                                        {link.label}
                                    </NavLink>
                                </li>
                            ))}    
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
