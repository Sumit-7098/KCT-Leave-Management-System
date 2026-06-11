import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import slider from "../assets/Main-slider.jpg";
import logo from "../assets/KC_logo-icon.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("HR");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword((p) => !p);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!adminId || !password || !role) {
      toast.error("Please fill all fields", { autoClose: 2000 });
      return;
    }

    setLoading(true);
    toast.dismiss();

    try {
      // Backend is currently user-login. We authenticate using logInID/logInPassword.
      // Role selection is validated/used server-side after backend changes.
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        {
          logInID: adminId,
          logInPassword: password,
          role,
        },
        { withCredentials: true }
      );

      toast.success("Login successful! Redirecting...", { autoClose: 2000 });

      // Backend uses httpOnly cookies, but some deployments also return token in body.
      if (response?.data?.token) {
        localStorage.setItem("token", response.data.token);
      }

      setTimeout(() => navigate("/"), 1200);

    } catch (err) {
      console.error("Admin login error:", err);
      toast.error(err.response?.data?.message || "Login failed. Please try again.", {
        autoClose: 2500,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed min-h-screen min-w-screen overflow-hidden">
      <img
        src={slider}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative flex items-center justify-center min-h-screen px-4">
        <div className="bg-gray-100/70 border-2 border-[#2354A2] rounded-3xl shadow-lg w-full max-w-md md:max-w-lg overflow-hidden">
          <div className="flex items-center gap-4 bg-gray-200 p-5 md:p-6 border-b border-[#2354A2]">
            <div className="bg-[#2354A2] flex items-center justify-center">
              <img
                src={logo}
                alt="logo-image"
                className="w-8 h-8 object-contain"
              />
            </div>

            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#2354A2]">Admin Login</h1>
              <p className="text-xs md:text-sm font-medium text-[#2354A2]">
                Enter ID, Password and Role to access admin dashboard
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[#2354A2] mb-2 font-medium">ID</label>
                <input
                  type="text"
                  required
                  placeholder="Enter Admin ID"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  className="w-full px-4 py-3 border border-[#2354A2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2354A2]"
                />
              </div>

              <div>
                <label className="block text-[#2354A2] mb-2 font-medium">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 border border-[#2354A2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2354A2]"
                >
                  <option value="HR">HR</option>
                  <option value="Manager">Manager</option>
                  <option value="Director">Director</option>
                </select>
              </div>

              <div>
                <label className="block text-[#2354A2] mb-2 font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-[#2354A2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2354A2]"
                  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-700 p-1"
                    onClick={togglePassword}
                    role="button"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold transition-all 
                  ${loading
                    ? "bg-gray-400 text-white cursor-not-allowed opacity-75"
                    : "bg-[#2354A2] text-white hover:bg-[#1e4486]"}
                `}
              >
                {loading ? "Logging in..." : "LOGIN"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

