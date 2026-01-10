import { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const isLoggedIn = !!localStorage.getItem("access_token");

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            window.location.href = "/auth/token";
            return;
        }

        fetch("https://api.my-duka.co.ke/users", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setUsers(data);
                setLoading(false);

                setTimeout(() => {
                    if ($.fn.DataTable.isDataTable("#usersTable")) {
                        $("#usersTable").DataTable().destroy();
                    }
                    $("#usersTable").DataTable({
                        pageLength: 10,
                        lengthChange: false,
                        ordering: true,
                        info: true,
                        autoWidth: false,
                    });
                }, 0);
            })
            .catch((err) => {
                console.error("Error fetching users:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading users...</p>;

    return (
        <div className="UsersPage d-flex flex-column min-vh-100">
            <Navbar isLoggedIn={isLoggedIn} />
            ...
        </div>
    );
}


export default Users;
