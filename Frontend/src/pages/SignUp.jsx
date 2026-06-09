import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import slider from "../assets/Main-slider.jpg";
import logo from "../assets/KC_logo-icon.png";
import { FaChevronDown } from "react-icons/fa";

function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    designation: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();

    try {
      const response = await axios.post("http://localhost:5000/api/user/signup", formData, {
        withCredentials: true
      });

      toast.success("Account created successfully! Check your email for login credentials.", { autoClose: 2000 });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen relative">
      {/* Background */}
      <img src={slider} alt="background" className="fixed inset-0 w-full h-full object-cover z-0" />

      {/* Form Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-2">
        <div className="bg-white/95 backdrop-blur-md border-2 border-[#2354A2] rounded-2xl shadow-xl w-85 md:w-95 overflow-hidden">

          {/* Header */}
          <div className="p-4 border-b border-[#2354A2]/30">
            <div className="flex items-center gap-2">
              <div className="bg-[#2354A2]  rounded-lg">
                <img src={logo} alt="logo" className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h1 className="text-lg font-bold text-[#2354A2]">
                  Sign Up
                </h1>
                <p className="text-xs text-gray-600 ">
                  Create your account
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-5 space-y-3">
            <form onSubmit={handleSubmit}>
              <div>
                <label className="block text-[#2354A2] text-xs font-medium mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Name"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2354A2]"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-[#2354A2] text-xs font-medium mb-1.5">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="email@company.com"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2354A2]"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-[#2354A2] text-xs font-medium mb-1.5">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  defaultValue="+91"
                  required
                  placeholder="Phone"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2354A2]"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-[#2354A2] text-xs font-medium mb-1.5">
                  Designation *
                </label>
                <div className="relative">
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 pr-8 text-sm border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-[#2354A2]"
                    disabled={loading}
                  >
                    <option>Select designation</option>
                    <option>Manager</option>
                    <option>HR</option>
                    <option>Developer</option>
                    <option>Intern</option>
                  </select>
                  <FaChevronDown className="absolute right-2 top-2.5 text-gray-400 text-xs pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[#2354A2] text-xs font-medium mb-1.5">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  required
                  placeholder="Address"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2354A2] resize-none h-16"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 bg-[#2354A2] hover:bg-[#1e4486] disabled:bg-gray-400 text-white py-2.5 font-medium rounded-lg text-sm transition-colors shadow-md"
              >
                {loading ? "Creating..." : "Sign Up"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" theme="colored" />
    </div>
  );
}

export default Signup;
