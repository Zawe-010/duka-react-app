import { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";

function Sales() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/sales")
            .then((res) => res.json())
            .then((data) => {
                setSales(data);
                setLoading(false);

                // Initialize DataTable after data is loaded
                $(document).ready(function () {
                    $("#salesTable").DataTable({
                        pageLength: 10, // Show 10 rows per page
                        lengthChange: false,
                        ordering: true,
                        info: true,
                        autoWidth: false,
                    });
                });
            })
            .catch((err) => {
                console.error("Error fetching sales:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading sales...</p>;

    return (
        <div className="table-responsive">
            <h2>Sales</h2>

            <table id="salesTable" className="table table-bordered table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>Product</th>
                        <th>Selling Price</th>
                        <th>Quantity</th>
                        <th>Total Amount</th>
                        <th>Date</th>
                    </tr>
                </thead>

                <tbody>
                    {sales.map((s) => (
                        <tr key={s.id}>
                            <td>{s.id}</td>
                            <td>{s.product_name}</td>
                            <td>{s.product_sp}</td>
                            <td>{s.quantity}</td>
                            <td>{s.amount}</td>
                            <td>{new Date(s.created_at).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Sales;
