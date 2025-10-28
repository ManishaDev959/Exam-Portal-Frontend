
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import PaymentPage from "./components/PaymentPage";

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      {token && <Navbar />} 

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={token ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard"
          element={token ? <UserDashboard /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />

          <Route path="/payment/:examFormId" element={<PaymentPage />} />
      </Routes>
    </Router>
  );
}
