import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Payments from "./pages/Payments";
import Users from "./pages/Users";
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgetPassword from './pages/ForgetPassword';
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";
import PrivateRoute from './components/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/verify-otp/:userId" element={<VerifyOTP />} />
        <Route path="/reset-password/:userId" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={<PrivateRoute><Dashboard /></PrivateRoute>}
        />
        <Route
          path="/products"
          element={<PrivateRoute><Products /></PrivateRoute>}
        />
        <Route
          path="/sales"
          element={<PrivateRoute><Sales /></PrivateRoute>}
        />
        <Route
          path="/users"
          element={<PrivateRoute><Users /></PrivateRoute>}
        />
        <Route
          path="/payments"
          element={<PrivateRoute><Payments /></PrivateRoute>}
        />
      </Routes>
    </Router>
  );
}

export default App;
