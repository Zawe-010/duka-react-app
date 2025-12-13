import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

function Home() {
    const isLoggedIn = false;

    return (
        <div className="App d-flex flex-column min-vh-100">
            {/* Make the main content grow to push footer down */}
            <Navbar isLoggedIn={isLoggedIn} />

            <main className="flex-grow-1">
                <Hero />
            </main>

            <Footer />
        </div>
    );
}

export default Home;
