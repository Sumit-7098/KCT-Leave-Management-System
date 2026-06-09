import { useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { ChevronDown, Upload, Send } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LeaveRequestForm from "./forms/LeaveRequestForm";
import CompensatoryOffForm from "./forms/CompensatoryOffForm";
import GatePassForm from "./forms/GatePassForm";
import OnDutyForm from "./forms/OnDutyForm";
import Loader from "../components/Loader";

const LEAVE_TYPES = [
  "Annual Leave",
  "Sick Leave",
  "Casual Leave",
  "Unpaid Leave",
];

const TABS = ["Leave Request", "Compensatory Off", "Gate Pass", "OD (On Duty)"];

export default function ApplyLeave() {
  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    document: null,
    inTime: "",
    outTime: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const { user } = useAuth();

  const resetForm = useCallback(() => {
    setForm({
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: "",
      document: null,
      inTime: "",
      outTime: "",
    });
    setErrors({});
    setSubmitted(false);
    setShowDropdown(false);
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (activeTab === 0) {
      if (!form.leaveType) newErrors.leaveType = "Leave type is required";
      if (!form.startDate) newErrors.startDate = "Start date is required";
      if (!form.endDate) newErrors.endDate = "End date is required";
      if (!form.reason.trim()) newErrors.reason = "Reason is required";
    } else if (activeTab === 1 || activeTab === 3) {
      // Comp Off, OD
      if (!form.inTime) newErrors.inTime = "In time is required";
      if (!form.outTime) newErrors.outTime = "Out time is required";
      if (!form.startDate) newErrors.startDate = "Start date is required";
      if (!form.endDate) newErrors.endDate = "End date is required";
    } else if (activeTab === 2) {
      // Gate Pass
      if (!form.startDate) newErrors.startDate = "Date is required";
      if (!form.inTime) newErrors.inTime = "In time is required";
      if (!form.outTime) newErrors.outTime = "Out time is required";
      if (!form.reason.trim()) newErrors.reason = "Reason is required";
    }

    if (
      form.startDate &&
      form.endDate &&
      new Date(form.startDate) > new Date(form.endDate)
    ) {
      newErrors.dateOrder = "Start date must be before end date";
    }

    if (form.reason && form.reason.length > 500) {
      newErrors.reason = "Reason cannot exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [activeTab, form]);

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setLoading(true);

    try {
      // Determine leaveType based on tab
      let submitLeaveType = form.leaveType;
      if (activeTab === 1) submitLeaveType = "Compensatory Off";
      else if (activeTab === 2) submitLeaveType = "Gate Pass";
      else if (activeTab === 3) submitLeaveType = "OD (On Duty)";

      const formData = new FormData();
      formData.append("leaveType", submitLeaveType);
      formData.append("startDate", form.startDate);
      formData.append("endDate", form.endDate);
      formData.append("reason", form.reason.trim());
      if (form.inTime) formData.append("inTime", form.inTime);
      if (form.outTime) formData.append("outTime", form.outTime);
      if (form.document) formData.append("document", form.document);

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login again");
        return;
      }

      const response = await fetch("http://localhost:5000/api/leave/apply", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Submission failed");
      }

      toast.success("Leave request submitted successfully!");
      setSubmitted(true);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateLeaveType = (type) => {
    setForm(prev => ({ ...prev, leaveType: type }));
    if (errors.leaveType) {
      setErrors(prev => ({ ...prev, leaveType: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }
    if (
      file &&
      !["image/*", "application/pdf"].some((m) => file.type.match(m))
    ) {
      toast.error("Only PDF and images allowed");
      return;
    }
    setForm(prev => ({ ...prev, document: file }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange({ target: { files: [file] } });
  };

  const getLeaveType = () => {
    switch (activeTab) {
      case 1:
        return "Compensatory Off";
      case 2:
        return "Gate Pass";
      case 3:
        return "OD (On Duty)";
      default:
        return "";
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-6 p-8">
        <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center">
          <Send className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">
          Request Submitted!
        </h2>
        <p className="text-sm text-slate-400 text-center max-w-md">
          Your {getLeaveType()} request has been sent for approval
        </p>
        <button
          onClick={resetForm}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200"
        >
          Submit New Request
        </button>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Apply for Leave</h1>
        <p className="text-sm text-slate-400 mt-1">
          Submit a new leave request
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap -mx-1.5 gap-3 *:m-1.5!">
        {TABS.map((tab, index) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(index);
              setForm({ ...form, leaveType: "", inTime: "", outTime: "" });
            }}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === index
            ? "bg-blue-600 text-white shadow-md"
              : "bg-white dark:bg-gray-800/50 border border-slate-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400 hover:shadow-sm text-slate-700 dark:text-slate-200"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-8 bg-linear-to-b from-blue-500 to-blue-600 rounded-full" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            {TABS[activeTab]}
          </h3>
        </div>

        <div className="space-y-6">
          {activeTab === 0 && (
            <LeaveRequestForm
              form={form}
              errors={errors}
              handleChange={handleChange}
              handleFileChange={handleFileChange}
              dragOver={dragOver}
              setDragOver={setDragOver}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              validateLeaveType={validateLeaveType}
            />
          )}
          {activeTab === 1 && (
            <CompensatoryOffForm
              form={form}
              errors={errors}
              handleChange={handleChange}
            />
          )}
          {activeTab === 2 && (
            <GatePassForm
              form={form}
              errors={errors}
              handleChange={handleChange}
              handleFileChange={handleFileChange}
              dragOver={dragOver}
              setDragOver={setDragOver}
            />
          )}
          {activeTab === 3 && (
            <OnDutyForm
              form={form}
              errors={errors}
              handleChange={handleChange}
            />
          )}
          {errors.dateOrder && (
            <p className="text-red-500 text-xs">
              {errors.dateOrder}
            </p>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <Loader size={20} message="Submitting..." />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit {TABS[activeTab]} Request
              </>
            )
            }
          </button>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
