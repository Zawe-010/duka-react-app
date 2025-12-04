import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
// import Header from './components/Header';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Payments from "./pages/Payments";
import Users from "./pages/Users";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const isLoggedIn = false;

  return (
    <BrowserRouter>
      <div className="App">
        {/* <Header></Header> */}

        <Navbar isLoggedIn={isLoggedIn}></Navbar>

        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/products" element={<Products />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/users" element={<Users />} />
          <Route path="/payments" element={<Payments />} />
        </Routes>

        <Footer></Footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
