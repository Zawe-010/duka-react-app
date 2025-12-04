import { useState, useEffect } from "react";
import $ from "jquery";
import "datatables.net-bs5"; // DataTables Bootstrap 5 integration
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/products")
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);

                // Initialize DataTable after data is loaded
                setTimeout(() => {
                    if ($.fn.DataTable.isDataTable("#productsTable")) {
                        $("#productsTable").DataTable().destroy();
                    }
                    $("#productsTable").DataTable({
                        pageLength: 10,      // 10 rows per page
                        lengthChange: false, // hide "rows per page" dropdown
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
        <div className="table-responsive">
            <h2>Products</h2>
            <table id="productsTable" className="table table-bordered table-striped">
                <thead>
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
    );
}

export default Products;
