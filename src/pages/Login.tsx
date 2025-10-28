import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/Auth/login",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, role } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Redirect based on role
      if (role === "Admin") navigate("/admin");
      else navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-indigo-500">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-600 mb-1 font-medium">Email</label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">Password</label>
            <input
              type="password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold py-2 rounded-lg transition text-white ${loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
