import { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";

function Payments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/payments")
            .then((res) => res.json())
            .then((data) => {
                setPayments(data);
                setLoading(false);

                // Initialize DataTable after data is loaded
                $(document).ready(function () {
                    $("#paymentsTable").DataTable({
                        pageLength: 10,
                        lengthChange: false,
                        ordering: true,
                        info: true,
                        autoWidth: false,
                    });
                });
            })
            .catch((err) => {
                console.error("Error fetching payments:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading payments...</p>;

    return (
        <div className="table-responsive">
            <h2>Payments</h2>

            <table id="paymentsTable" className="table table-bordered table-striped">
                <thead className="thead-dark">
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
    );
}

export default Payments;
