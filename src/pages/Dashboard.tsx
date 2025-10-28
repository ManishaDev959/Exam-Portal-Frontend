import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";

export default function Dashboard() {
  const navigate = useNavigate();
 const [role, setRole] = useState<string | null>(null);


  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/login");
      return;
    }
    setRole(role);
  }, [navigate]);

  if (!role) return <p>Loading dashboard...</p>;

  if (role === "Admin") return <AdminDashboard />;
  if (role === "User") return <UserDashboard />;

  return <p>Unauthorized role: {role}</p>;
}
