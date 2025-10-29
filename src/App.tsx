
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
      {<Navbar />} 

      <Routes>
        <Route path="/" element={<Navigate to="/register"/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />
        <Route
          path="/dashboard"
          element={<UserDashboard />}
        />
          <Route path="/payment/:examFormId" element={<PaymentPage />} />

                <Route path="*" element={<Navigate to="/register"/>} />
      </Routes>
    </Router>
  );
}
