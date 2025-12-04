import { useState, useEffect } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const isLoggedIn = false; // Update based on your login logic

    useEffect(() => {
        fetch("http://127.0.0.1:8000/products")
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);

                setTimeout(() => {
                    if ($.fn.DataTable.isDataTable("#productsTable")) {
                        $("#productsTable").DataTable().destroy();
                    }
                    $("#productsTable").DataTable({
                        pageLength: 10,
                        lengthChange: false,
                        ordering: true,
                        info: true,
                        autoWidth: false,
                    });
                }, 0);
            })
            .catch(err => {
                console.error("Error fetching products:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading products...</p>;

    return (
        <div className="ProductsPage d-flex flex-column min-vh-100">
            <Navbar isLoggedIn={isLoggedIn} />

            <div className="container flex-grow-1 mt-4">
                <h2>Products</h2>
                <div className="table-responsive">
                    <table id="productsTable" className="table table-bordered table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Buying Price (KES)</th>
                                <th>Selling Price (KES)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.buying_price}</td>
                                    <td>{product.selling_price}</td>
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

export default Products;
