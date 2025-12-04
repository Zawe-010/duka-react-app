import { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const isLoggedIn = false; // adjust according to your auth logic

    useEffect(() => {
        fetch("http://127.0.0.1:8000/users")
            .then((res) => res.json())
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

            <div className="container flex-grow-1 mt-4">
                <h2>Users</h2>
                <div className="table-responsive">
                    <table id="usersTable" className="table table-bordered table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th>ID</th>
                                <th>Full Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.full_name}</td>
                                    <td>{user.email}</td>
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
