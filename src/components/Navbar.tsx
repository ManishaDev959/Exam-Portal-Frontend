import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);

 
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (token && userRole) {
      setIsAuthenticated(true);
      setRole(userRole);
    } else {
      setIsAuthenticated(false);
      setRole(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setRole(null);
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <Link to="/" className="text-lg font-semibold">
        Exam Portal
      </Link>

      <div className="flex items-center space-x-4">
        {!isAuthenticated ? (
          <Link to="/login" className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100">
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
