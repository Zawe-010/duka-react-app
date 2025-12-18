import { useState, useEffect, useCallback } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Sales() {
    const token = localStorage.getItem("token");

    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedProduct, setSelectedProduct] = useState("");
    const [quantity, setQuantity] = useState("");
    const [showSaleModal, setShowSaleModal] = useState(false);
    const [saleMessage, setSaleMessage] = useState("");

    const [selectedSale, setSelectedSale] = useState(null);
    const [showPayModal, setShowPayModal] = useState(false);
    const [transactionNumber, setTransactionNumber] = useState("");
    const [payMessage, setPayMessage] = useState("");
    const [payProcessing, setPayProcessing] = useState(false);

    /* ---------------- LOAD PRODUCTS ---------------- */
    useEffect(() => {
        fetch("https://api.my-duka.co.ke/products", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (res) => {
                if (!res.ok) {
                    if (res.status === 401 || res.status === 403) {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    }
                    const text = await res.text();
                    throw new Error(`Request failed: ${res.status}, ${text}`);
                }
                return res.json();
            })
            .then(setProducts)
            .catch(console.error);
    }, [token]);

    /* ---------------- LOAD SALES ---------------- */
    const loadSales = useCallback(() => {
        setLoading(true);
        fetch("https://api.my-duka.co.ke/sales", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (res) => {
                if (!res.ok) {
                    if (res.status === 401 || res.status === 403) {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    }
                    const text = await res.text();
                    throw new Error(`Request failed: ${res.status}, ${text}`);
                }
                return res.json();
            })
            .then(setSales)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [token]);

    useEffect(() => {
        loadSales();
    }, [loadSales]);

    /* ---------------- DATATABLE ---------------- */
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

    /* ---------------- ADD SALE ---------------- */
    const handleAddSale = (e) => {
        e.preventDefault();
        if (!selectedProduct || !quantity) return;

        fetch("https://api.my-duka.co.ke/sales", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ pid: selectedProduct, quantity: Number(quantity) }),
        })
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Request failed: ${res.status}, ${text}`);
                }
                return res.json();
            })
            .then(() => {
                setShowSaleModal(false);
                setSelectedProduct("");
                setQuantity("");
                setSaleMessage("Sale recorded successfully.");
                loadSales();
                setTimeout(() => setSaleMessage(""), 4000);
            })
            .catch((err) => {
                console.error(err);
                setSaleMessage(`Error: ${err.message}`);
            });
    };

    /* ---------------- M-PESA PAYMENT ---------------- */
    const handleMpesaPayment = async () => {
        if (!selectedSale) return;
        setPayProcessing(true);
        setPayMessage("Processing payment...");

        try {
            // Format phone number
            let phone = transactionNumber.trim().replace(/\D/g, "");
            if (phone.startsWith("0")) phone = "254" + phone.slice(1);
            else if (phone.startsWith("7")) phone = "254" + phone;
            else if (phone.startsWith("+254")) phone = phone.slice(1);
            else if (!phone.startsWith("254")) phone = "254" + phone;

            const res = await fetch(`https://api.my-duka.co.ke/mpesa/stkpush`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    amount: selectedSale.amount,
                    phone_number: phone,
                    sale_id: selectedSale.id,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setPayMessage(data.detail || data.error || "Payment initiation failed");
                setPayProcessing(false);
                return;
            }

            setPayMessage("Payment initiated. Complete it on your phone.");

            // Polling to check payment status
            const interval = setInterval(async () => {
                try {
                    const checkRes = await fetch(
                        `https://api.my-duka.co.ke/mpesa/checker/${selectedSale.id}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    const checkData = await checkRes.json();
                    if (checkData.trans_code) {
                        setPayMessage(`Payment completed: ${checkData.trans_code}`);
                        setSales(prev => prev.map(s => s.id === selectedSale.id ? { ...s, ...checkData } : s));
                        setShowPayModal(false);
                        setSelectedSale(null);
                        setTransactionNumber("");
                        setPayProcessing(false);
                        clearInterval(interval);
                    }
                } catch (err) {
                    console.error("Error checking payment:", err);
                }
            }, 5000);
        } catch (err) {
            console.error(err);
            setPayMessage("Payment failed");
            setPayProcessing(false);
        }
    };

    if (loading) return <p className="text-center mt-4">Loading sales...</p>;

    return (
        <div className="SalesPage d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container flex-grow-1 mt-4">
                {saleMessage && <div className="alert alert-success">{saleMessage}</div>}

                <button className="btn btn-primary mb-3" onClick={() => setShowSaleModal(true)}>
                    Add Sale
                </button>

                {/* ADD SALE MODAL */}
                {showSaleModal && (
                    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add Sale</h5>
                                    <button className="btn-close" onClick={() => setShowSaleModal(false)} />
                                </div>
                                <form onSubmit={handleAddSale}>
                                    <div className="modal-body">
                                        <select
                                            className="form-select mb-2"
                                            value={selectedProduct}
                                            onChange={(e) => setSelectedProduct(e.target.value)}
                                            required
                                        >
                                            <option value="">Select product</option>
                                            {products.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            min="1"
                                            className="form-control"
                                            placeholder="Quantity"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowSaleModal(false)}>
                                            Close
                                        </button>
                                        <button type="submit" className="btn btn-primary">Save Sale</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* SALES TABLE */}
                <div className="table-responsive">
                    <table id="salesTable" className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Total Amount</th>
                                <th>Date</th>
                                <th>Pay</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map((s) => (
                                <tr key={s.id}>
                                    <td>{s.id}</td>
                                    <td>{s.product_name}</td>
                                    <td>{s.quantity}</td>
                                    <td>{s.amount ?? "Pending"}</td>
                                    <td>{new Date(s.created_at).toLocaleString()}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => {
                                                setSelectedSale(s);
                                                setShowPayModal(true);
                                            }}
                                        >
                                            Pay Now
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PAY NOW MODAL */}
                {showPayModal && selectedSale && (
                    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header" style={{ backgroundColor: "#0d6efd", color: "#fff" }}>
                                    <h5 className="modal-title">Pay Sale #{selectedSale.id}</h5>
                                    <button className="btn-close" onClick={() => setShowPayModal(false)} />
                                </div>
                                <div className="modal-body">
                                    <p>Amount: {selectedSale.amount ?? "Pending"}</p>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Phone Number"
                                        value={transactionNumber}
                                        onChange={(e) => setTransactionNumber(e.target.value)}
                                    />
                                    {payMessage && <p className="text-success mt-2">{payMessage}</p>}
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setShowPayModal(false)}>
                                        Close
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleMpesaPayment}
                                        disabled={payProcessing}
                                    >
                                        {payProcessing ? "Processing..." : "Pay via M-Pesa"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Sales;
