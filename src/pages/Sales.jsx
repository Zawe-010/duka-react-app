import { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Sales() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const isLoggedIn = false; // update according to your login logic

    useEffect(() => {
        fetch("http://127.0.0.1:8000/sales")
            .then((res) => res.json())
            .then((data) => {
                setSales(data);
                setLoading(false);

                setTimeout(() => {
                    if ($.fn.DataTable.isDataTable("#salesTable")) {
                        $("#salesTable").DataTable().destroy();
                    }
                    $("#salesTable").DataTable({
                        pageLength: 10,
                        lengthChange: false,
                        ordering: true,
                        info: true,
                        autoWidth: false,
                    });
                }, 0);
            })
            .catch((err) => {
                console.error("Error fetching sales:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading sales...</p>;

    return (
        <div className="SalesPage d-flex flex-column min-vh-100">
            <Navbar isLoggedIn={isLoggedIn} />

            <div className="container flex-grow-1 mt-4">
                <h2>Sales</h2>
                <div className="table-responsive">
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
            </div>

            <Footer />
        </div>
    );
}

export default Sales;
