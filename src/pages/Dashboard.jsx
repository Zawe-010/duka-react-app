import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Bar, Line } from "react-chartjs-2";
import 'chart.js/auto'; // needed for chart.js v3+

function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch dashboard data from FastAPI
        fetch("http://127.0.0.1:8000/dashboard")
            .then((res) => res.json())
            .then((data) => {
                setDashboardData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Dashboard fetch error:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    if (!dashboardData) {
        return <p className="text-center mt-5">Failed to load dashboard data.</p>;
    }

    const { profit_per_product, sales_per_day } = dashboardData;

    const barData = {
        labels: profit_per_product.products_name,
        datasets: [{
            label: "Profit per Product",
            data: profit_per_product.products_sales,
            backgroundColor: profit_per_product.products_colour
        }]
    };

    const lineData = {
        labels: sales_per_day.dates,
        datasets: [{
            label: "Sales per Day",
            data: sales_per_day.sales,
            borderColor: "#3e95cd",
            fill: false
        }]
    };

    return (
        <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar isLoggedIn={true} />

            {/* Main content grows to push footer down */}
            <div className="container mt-5" style={{ flex: 1 }}>
                <div className="text-white p-4 rounded mb-4" style={{ backgroundColor: '#6f42c1' }}>
                    <h2>Dashboard Overview</h2>
                    <p>Your central hub for monitoring business performance.</p>
                </div>

                <div className="mb-5">
                    <Bar data={barData} />
                </div>

                <div className="mb-5">
                    <Line data={lineData} />
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Dashboard;
