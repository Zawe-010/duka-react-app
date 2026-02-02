import { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Users() {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const token = localStorage.getItem("access_token");

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const isLoggedIn = !!token;

    useEffect(() => {
        if (!token) {
            window.location.href = "/auth/login";
            return;
        }

        fetch(`${BACKEND_URL}/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then(async (res) => {
                if (!res.ok) {
                    if (res.status === 401 || res.status === 403) {
                        localStorage.removeItem("access_token");
                        window.location.href = "/auth/login";
                    }
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
    }, [token, BACKEND_URL]);

    if (loading) {
        return <p className="text-center mt-4">Loading users...</p>;
    }

    return (
        <div className="UsersPage d-flex flex-column min-vh-100">
            <Navbar isLoggedIn={isLoggedIn} />

            <div className="container flex-grow-1 mt-4">
                <h2>Users</h2>

                <div className="table-responsive">
                    <table
                        id="usersTable"
                        className="table table-bordered table-striped"
                    >
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.full_name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role ?? "—"}</td>
                                    <td>
                                        {new Date(user.created_at).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Users;
