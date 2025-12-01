function Hero() {
    return (
        <section style={{ backgroundColor: 'white', padding: '80px 0' }}>
            <div className="container text-center">

                {/* Heading */}
                <h1 className="mb-4 fw-bold" style={{ color: 'black' }}>Welcome to My-Duka</h1>

                {/* Description */}
                <p className="lead mb-5" style={{ color: 'black' }}>
                    My-Duka helps you manage inventory and track sales performance efficiently.
                </p>

                {/* Feature Cards */}
                <div className="row justify-content-center">
                    {/* Card 1 */}
                    <div className="col-md-4 mb-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body text-center">
                                <h5 className="card-title fw-bold">Product Management</h5>
                                <p className="card-text">
                                    Easily view, add, and update product details including prices and stock levels.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="col-md-4 mb-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body text-center">
                                <h5 className="card-title fw-bold">Sales Tracking</h5>
                                <p className="card-text">
                                    Monitor sales performance, quantities sold, and trends over time.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="col-md-4 mb-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body text-center">
                                <h5 className="card-title fw-bold">Dashboard Overview</h5>
                                <p className="card-text">
                                    Get a quick snapshot of your inventory and business health in one place.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Get Started Button (AFTER cards) */}
                <a
                    href="/register"
                    className="btn btn-primary btn-lg fw-bold mt-4"
                    style={{
                        backgroundColor: '#6f42c1',
                        borderColor: '#6f42c1',
                        transition: '0.3s'
                    }}
                    onMouseEnter={e => {
                        e.target.style.backgroundColor = 'black';
                        e.target.style.borderColor = 'black';
                    }}
                    onMouseLeave={e => {
                        e.target.style.backgroundColor = '#6f42c1';
                        e.target.style.borderColor = '#6f42c1';
                    }}
                >
                    Get Started
                </a>

            </div>
        </section>
    );
}

export default Hero;
