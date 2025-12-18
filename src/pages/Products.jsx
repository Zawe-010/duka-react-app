import { useState, useEffect } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Products() {
    const token = localStorage.getItem("token");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        buying_price: "",
        selling_price: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            buying_price: product.buying_price,
            selling_price: product.selling_price
        });
        setEditId(product.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const url = isEditing
            ? `https://api.my-duka.co.ke/products/${editId}`
            : "https://api.my-duka.co.ke/products";

        const method = isEditing ? "PUT" : "POST";

        fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        })
            .then(async (res) => {
                if (!res.ok) {
                    if (res.status === 401 || res.status === 403) {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    }
                    const text = await res.text();
                    console.error("Server response:", text);
                    throw new Error(`Request failed: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                if (isEditing) {
                    setProducts(products.map(p => p.id === editId ? data : p));
                    setIsEditing(false);
                    setEditId(null);
                } else {
                    setProducts([...products, data]);
                }

                setFormData({ name: "", buying_price: "", selling_price: "" });
                setShowModal(false);
            })
            .catch((err) => console.error("ERROR:", err));
    };

    useEffect(() => {
        fetch("https://api.my-duka.co.ke/products", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(setProducts)
            .finally(() => setLoading(false));
    }, [token]);

    useEffect(() => {
        if (products.length > 0) {
            if ($.fn.DataTable.isDataTable("#productsTable")) {
                $("#productsTable").DataTable().destroy();
            }
            requestAnimationFrame(() => {
                $("#productsTable").DataTable({ pageLength: 10 });
            });
        }
    }, [products]);

    if (loading) return <p className="text-center mt-5">Loading products...</p>;

    return (
        <div className="ProductsPage d-flex flex-column min-vh-100">
            <Navbar />

            <div className="container flex-grow-1 mt-4">
                <button
                    className="btn btn-primary mb-3"
                    onClick={() => {
                        setIsEditing(false);
                        setFormData({ name: "", buying_price: "", selling_price: "" });
                        setShowModal(true);
                    }}
                >
                    Add Product
                </button>

                {showModal && (
                    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        {isEditing ? "Edit Product" : "Add Product"}
                                    </h5>
                                    <button className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body">
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="form-control mb-2"
                                            required
                                        />
                                        <input
                                            name="buying_price"
                                            type="number"
                                            value={formData.buying_price}
                                            onChange={handleChange}
                                            className="form-control mb-2"
                                            required
                                        />
                                        <input
                                            name="selling_price"
                                            type="number"
                                            value={formData.selling_price}
                                            onChange={handleChange}
                                            className="form-control mb-2"
                                            required
                                        />
                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Close
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            {isEditing ? "Update Product" : "Save Product"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                <div className="table-responsive">
                    <table id="productsTable" className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Buying Price</th>
                                <th>Selling Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.name}</td>
                                    <td>{p.buying_price}</td>
                                    <td>{p.selling_price}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => handleEdit(p)}
                                        >
                                            Edit
                                        </button>
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

export default Products;
