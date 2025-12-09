import { useState, useEffect } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Sales() {
    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedProduct, setSelectedProduct] = useState("");
    const [quantity, setQuantity] = useState("");
    const [showSaleModal, setShowSaleModal] = useState(false);
    const [saleMessage, setSaleMessage] = useState("");

    const [selectedSale, setSelectedSale] = useState(null);
    const [showPayModal, setShowPayModal] = useState(false);
    const [payAmount, setPayAmount] = useState("");
    const [transactionNumber, setTransactionNumber] = useState("");

    // Load products
    useEffect(() => {
        fetch("http://127.0.0.1:8000/products")
            .then(res => res.json())
            .then(setProducts)
            .catch(console.error);
    }, []);

    // Load sales
    const loadSales = () => {
        setLoading(true);
        fetch("http://127.0.0.1:8000/sales")
            .then(res => res.json())
            .then(setSales)
            .catch(console.error)
            .finally(() => setLoading(false));
    };
    useEffect(() => { loadSales(); }, []);

    // Initialize DataTable with fixed header
    useEffect(() => {
        if (sales.length > 0) {
            if ($.fn.DataTable.isDataTable("#salesTable")) {
                $("#salesTable").DataTable().destroy();
            }
            requestAnimationFrame(() => {
                $("#salesTable").DataTable({
                    pageLength: 10,
                    scrollY: "400px",
                    scrollCollapse: true,
                    fixedHeader: true,
                });
            });
        }
    }, [sales]);

    // Add Sale
    const handleAddSale = (e) => {
        e.preventDefault();
        if (!selectedProduct || !quantity) return;

        fetch("http://127.0.0.1:8000/sales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pid: selectedProduct, quantity })
        })
            .then(res => res.json())
            .then(() => {
                setShowSaleModal(false);
                setSelectedProduct("");
                setQuantity("");
                setSaleMessage("Sale recorded successfully.");
                loadSales();
                setTimeout(() => setSaleMessage(""), 4000);
            })
            .catch(console.error);
    };

    // Open Pay modal
    const handleOpenPayModal = (sale) => {
        setSelectedSale(sale);
        setPayAmount(sale.amount);
        setTransactionNumber("");
        setShowPayModal(true);
    };

    // Confirm payment (stub)
    const handleConfirmPayment = () => {
        console.log(`Paying ${payAmount} for sale ID ${selectedSale.id} using ${transactionNumber}`);
        // TODO: implement actual backend POST for payment
        setShowPayModal(false);
        setSelectedSale(null);
        setPayAmount("");
        setTransactionNumber("");
    };

    if (loading) return <p>Loading sales...</p>;

    return (
        <div className="SalesPage d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container flex-grow-1 mt-4">
                {saleMessage && <div className="alert alert-success">{saleMessage}</div>}

                {/* Add Sale Button */}
                <button className="btn btn-primary mb-3" onClick={() => setShowSaleModal(true)}>Add Sale</button>

                {/* Add Sale Modal */}
                {showSaleModal && (
                    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add Sale</h5>
                                    <button className="btn-close" onClick={() => setShowSaleModal(false)}></button>
                                </div>
                                <form onSubmit={handleAddSale}>
                                    <div className="modal-body">
                                        <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} required className="form-select mb-2">
                                            <option value="">Select product</option>
                                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                        <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} min="1" required className="form-control" placeholder="Quantity" />
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowSaleModal(false)}>Close</button>
                                        <button type="submit" className="btn btn-primary">Save Sale</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pay Modal */}
                {showPayModal && selectedSale && (
                    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Make Payment</h5>
                                    <button className="btn-close" onClick={() => setShowPayModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <p>Pay for <strong>{selectedSale.product_name}</strong></p>
                                    <p>Amount: <strong>{payAmount}</strong></p>
                                    <input
                                        type="number"
                                        value={payAmount}
                                        onChange={e => setPayAmount(e.target.value)}
                                        className="form-control mb-2"
                                    />
                                    <input
                                        type="text"
                                        value={transactionNumber}
                                        onChange={e => {
                                            const val = e.target.value;
                                            if (/^(\+2547|07|\+2541|01)?[0-9]{0,8}$/.test(val)) {
                                                setTransactionNumber(val);
                                            }
                                        }}
                                        className="form-control"
                                        placeholder="Enter phone number (+2547, +2541, 07, or 01)"
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setShowPayModal(false)}>Close</button>
                                    <button className="btn btn-primary" onClick={handleConfirmPayment}>Confirm Payment</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sales Table */}
                <div className="table-responsive">
                    <table id="salesTable" className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Total Amount</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map(s => (
                                <tr key={s.id}>
                                    <td>{s.id}</td>
                                    <td>{s.product_name}</td>
                                    <td>{s.quantity}</td>
                                    <td>{s.amount}</td>
                                    <td>{new Date(s.created_at).toLocaleString()}</td>
                                    <td>
                                        <button className="btn btn-primary btn-sm" onClick={() => handleOpenPayModal(s)}>Pay Here</button>
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

export default Sales;
