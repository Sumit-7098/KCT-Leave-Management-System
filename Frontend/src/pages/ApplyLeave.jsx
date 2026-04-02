import { useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { ChevronDown, Upload, Send, Calendar, Clock, User } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LEAVE_TYPES = [
  "Annual Leave",
  "Sick Leave",
  "Casual Leave",
  "Maternity Leave",
  "Paternity Leave",
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
      if (!form.reason.trim()) newErrors.reason = "Reason is required";
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
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
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
    setForm({ ...form, document: file });
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
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 p-8">
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
        <h1 className="text-2xl font-bold text-slate-800">Apply for Leave</h1>
        <p className="text-sm text-slate-400 mt-1">
          Submit a new leave request
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3">
        {TABS.map((tab, index) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(index);
              setForm({ ...form, leaveType: "", inTime: "", outTime: "" });
            }}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === index
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
          <h3 className="text-lg font-bold text-slate-800">
            {TABS[activeTab]}
          </h3>
        </div>

        <div className="space-y-6">
          {activeTab === 0 && (
            <>
              {/* Leave Type Dropdown */}
              <div className="relative">
                <label className="block text-xs font-semibold text-blue-600 mb-2">
                  Leave Type <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`w-full p-4 pr-10 rounded-xl border-2 text-sm transition-all duration-200 flex items-center justify-between ${
                    form.leaveType
                      ? "border-blue-400 bg-blue-50 text-slate-800"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span>{form.leaveType || "Select leave type"}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                  />
                </button>
                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-60 overflow-auto">
                    {LEAVE_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setForm({ ...form, leaveType: type });
                          setShowDropdown(false);
                        }}
                        className={`w-full text-left p-3 text-sm hover:bg-blue-50 ${
                          form.leaveType === type
                            ? "bg-blue-100 font-semibold"
                            : ""
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
                {errors.leaveType && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.leaveType}
                  </p>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className={`w-full p-4 rounded-xl border-2 text-sm focus:outline-none focus:border-blue-500 transition-all ${
                      errors.startDate
                        ? "border-red-300"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className={`w-full p-4 rounded-xl border-2 text-sm focus:outline-none focus:border-blue-500 transition-all ${
                      errors.endDate
                        ? "border-red-300"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>
              {errors.dateOrder && (
                <p className="text-red-500 text-xs col-span-2">
                  {errors.dateOrder}
                </p>
              )}

              {/* Reason */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Provide detailed reason for your leave request..."
                  className={`w-full p-4 rounded-xl border-2 resize-vertical text-sm focus:outline-none focus:border-blue-500 transition-all ${
                    errors.reason
                      ? "border-red-300"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                />
                {errors.reason && (
                  <p className="text-red-500 text-xs mt-1">{errors.reason}</p>
                )}
              </div>

              {/* Document Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Supporting Document (Optional)
                </label>
                <div
                  className={`p-8 border-2 border-dashed rounded-xl text-center transition-all duration-200 cursor-pointer flex flex-col items-center gap-3 ${
                    dragOver
                      ? "border-blue-400 bg-blue-25"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <Upload className="w-8 h-8 text-slate-400" />
                  {form.document ? (
                    <p className="text-sm font-semibold text-emerald-600">
                      {form.document.name}
                    </p>
                  ) : (
                    <>
                      <p className="text-sm text-slate-600 font-medium">
                        Click to upload or drag & drop
                      </p>
                      <p className="text-xs text-slate-400">
                        PDF, JPG, PNG (Max 5MB)
                      </p>
                    </>
                  )}
                </div>
                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </>
          )}

          {(activeTab === 1 || activeTab === 3) && (
            <>
              {/* Time Grid for Comp Off / OD */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    In Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="inTime"
                    value={form.inTime}
                    onChange={handleChange}
                    className={`w-full p-4 rounded-xl border-2 text-sm focus:outline-none focus:border-blue-500 transition-all ${
                      errors.inTime
                        ? "border-red-300"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  />
                  {errors.inTime && (
                    <p className="text-red-500 text-xs mt-1">{errors.inTime}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Out Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="outTime"
                    value={form.outTime}
                    onChange={handleChange}
                    className={`w-full p-4 rounded-xl border-2 text-sm focus:outline-none focus:border-blue-500 transition-all ${
                      errors.outTime
                        ? "border-red-300"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  />
                  {errors.outTime && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.outTime}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Duration
                  </label>
                  <input
                    value={
                      form.inTime && form.outTime
                        ? (() => {
                            const [ih, im] = form.inTime.split(":");
                            const [oh, om] = form.outTime.split(":");
                            let mins =
                              parseInt(oh) * 60 +
                              parseInt(om) -
                              (parseInt(ih) * 60 + parseInt(im));
                            if (mins < 0) mins += 1440;
                            const hours = Math.floor(mins / 60);
                            const m = mins % 60;
                            return `${hours.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
                          })()
                        : "--:--"
                    }
                    readOnly
                    className="w-full p-4 rounded-xl border bg-slate-50 border-slate-200 text-sm text-slate-600 font-mono"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className={`w-full p-4 rounded-xl border-2 text-sm focus:outline-none focus:border-blue-500 transition-all ${errors.startDate ? "border-red-300" : "border-slate-200 hover:border-slate-300"}`}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className={`w-full p-4 rounded-xl border-2 text-sm focus:outline-none focus:border-blue-500 transition-all ${errors.endDate ? "border-red-300" : "border-slate-200 hover:border-slate-300"}`}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>
              {errors.dateOrder && (
                <p className="text-red-500 text-xs col-span-2">
                  {errors.dateOrder}
                </p>
              )}

              {/* Reason */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full p-4 rounded-xl border-2 resize-vertical text-sm focus:outline-none focus:border-blue-500 transition-all ${errors.reason ? "border-red-300" : "border-slate-200 hover:border-slate-300"}`}
                />
                {errors.reason && (
                  <p className="text-red-500 text-xs mt-1">{errors.reason}</p>
                )}
              </div>
            </>
          )}

          {activeTab === 2 && (
            <>
              {/* Time Grid for Gate Pass */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className={`w-full p-4 rounded-xl border-2 text-sm focus:outline-none focus:border-blue-500 transition-all ${errors.startDate ? "border-red-300" : "border-slate-200 hover:border-slate-300"}`}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    In Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="inTime"
                    value={form.inTime}
                    onChange={handleChange}
                    className={`w-full p-4 rounded-xl border-2 text-sm focus:outline-none focus:border-blue-500 transition-all ${errors.inTime ? "border-red-300" : "border-slate-200 hover:border-slate-300"}`}
                  />
                  {errors.inTime && (
                    <p className="text-red-500 text-xs mt-1">{errors.inTime}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Out Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="outTime"
                    value={form.outTime}
                    onChange={handleChange}
                    className={`w-full p-4 rounded-xl border-2 text-sm focus:outline-none focus:border-blue-500 transition-all ${errors.outTime ? "border-red-300" : "border-slate-200 hover:border-slate-300"}`}
                  />
                  {errors.outTime && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.outTime}
                    </p>
                  )}
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full p-4 rounded-xl border-2 resize-vertical text-sm focus:outline-none focus:border-blue-500 transition-all ${errors.reason ? "border-red-300" : "border-slate-200 hover:border-slate-300"}`}
                />
                {errors.reason && (
                  <p className="text-red-500 text-xs mt-1">{errors.reason}</p>
                )}
              </div>

              {/* Document Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Supporting Document (Optional)
                </label>
                <div
                  className={`p-8 border-2 border-dashed rounded-xl text-center transition-all duration-200 cursor-pointer flex flex-col items-center gap-3 ${dragOver ? "border-blue-400 bg-blue-25" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <Upload className="w-8 h-8 text-slate-400" />
                  {form.document ? (
                    <p className="text-sm font-semibold text-emerald-600">
                      {form.document.name}
                    </p>
                  ) : (
                    <>
                      <p className="text-sm text-slate-600 font-medium">
                        Click to upload or drag & drop
                      </p>
                      <p className="text-xs text-slate-400">
                        PDF, JPG, PNG (Max 5MB)
                      </p>
                    </>
                  )}
                </div>
                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit {TABS[activeTab]} Request
              </>
            )}
          </button>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
