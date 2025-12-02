import './App.css';
// import Header from './components/Header';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Products from './components/Products';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const isLoggedIn = false; 

  return (
    <div className="App">
      {/* <Header></Header> */}

      <Navbar isLoggedIn={isLoggedIn}></Navbar>

      <Hero></Hero>

      <Products></Products>

      <Footer></Footer>

    </div>
  );
}

export default App;
