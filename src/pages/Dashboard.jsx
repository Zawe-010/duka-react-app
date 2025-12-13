import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Bar, Line } from "react-chartjs-2";
import 'chart.js/auto';

function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token"); // assume PrivateRoute ensures token exists

    useEffect(() => {
        fetch("http://127.0.0.1:8000/dashboard", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (res) => {
                if (!res.ok) {
                    if (res.status === 401) {
                        localStorage.removeItem("token"); // token expired or invalid
                        window.location.href = "/login"; // force redirect
                    }
                    throw new Error("Failed to fetch dashboard data");
                }
                return res.json();
            })
            .then((data) => setDashboardData(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [token]);

    if (loading) return <p className="text-center mt-5">Loading dashboard...</p>;
    if (!dashboardData) return <p className="text-center mt-5">Failed to load dashboard data.</p>;

    const { profit_per_product, sales_per_day } = dashboardData;

    const barData = {
        labels: profit_per_product?.products_name || [],
        datasets: [
            {
                label: "Profit per Product",
                data: profit_per_product?.products_sales || [],
                backgroundColor: profit_per_product?.products_colour || []
            }
        ]
    };

    const lineData = {
        labels: sales_per_day?.dates || [],
        datasets: [
            {
                label: "Sales per Day",
                data: sales_per_day?.sales || [],
                borderColor: "#3e95cd",
                fill: false
            }
        ]
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar isLoggedIn={true} />
            <div className="container mt-5 flex-grow-1">
                <div className="text-white p-4 rounded mb-4" style={{ backgroundColor: '#6f42c1' }}>
                    <h2>Dashboard Overview</h2>
                    <p>Your central hub for monitoring business performance.</p>
                </div>
                <div className="mb-5"><Bar data={barData} /></div>
                <div className="mb-5"><Line data={lineData} /></div>
            </div>
            <Footer />
        </div>
    );
}

export default Dashboard;
