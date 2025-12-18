import { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Payments() {
    const token = localStorage.getItem("token"); // token exists via PrivateRoute
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://api.my-duka.co.ke/payments", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (res) => {
                if (!res.ok) {
                    if (res.status === 401 || res.status === 403) {
                        localStorage.removeItem("token");
                        window.location.href = "/login"; // force redirect if token invalid
                    }
                    const text = await res.text();
                    console.error("Server response:", text);
                    throw new Error(`Request failed: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setPayments(data);
                setLoading(false);

                // Initialize DataTable
                setTimeout(() => {
                    if ($.fn.DataTable.isDataTable("#paymentsTable")) {
                        $("#paymentsTable").DataTable().destroy();
                    }
                    $("#paymentsTable").DataTable({
                        pageLength: 10,
                        lengthChange: false,
                        ordering: true,
                        info: true,
                        autoWidth: false,
                    });
                }, 0);
            })
            .catch((err) => {
                console.error("Error fetching payments:", err);
                setLoading(false);
            });
    }, [token]);

    if (loading) return <p className="text-center mt-4">Loading payments...</p>;

    return (
        <div className="PaymentsPage d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container flex-grow-1 mt-4">
                <h2>Payments</h2>
                <div className="table-responsive">
                    <table id="paymentsTable" className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Sale ID</th>
                                <th>MRID</th>
                                <th>CRID</th>
                                <th>Amount</th>
                                <th>Transaction Code</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment.id}>
                                    <td>{payment.id}</td>
                                    <td>{payment.sale_id}</td>
                                    <td>{payment.mrid}</td>
                                    <td>{payment.crid}</td>
                                    <td>{payment.amount}</td>
                                    <td>{payment.trans_code || "—"}</td>
                                    <td>{new Date(payment.created_at).toLocaleString()}</td>
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

export default Payments;
