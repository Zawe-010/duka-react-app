import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

function Home() {
    const isLoggedIn = false; 

    return (
        <div className="App">
            <Navbar isLoggedIn={isLoggedIn} />
            <Hero />
            <Footer />
        </div>
    );
}

export default Home;
