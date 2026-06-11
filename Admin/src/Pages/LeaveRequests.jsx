import React, { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiCheckCircle,
  FiXCircle,
  FiFilter,
  FiEye,
} from "react-icons/fi";
import { RiArrowDropDownLine } from "react-icons/ri";
import {
  approveLeaveRequest,
  fetchLeaveRequests,
  rejectLeaveRequest,
} from "../api/leaveAdminApi";

export default function LeaveRequests() {
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewModal, setViewModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaveData, setLeaveData] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchLeaveRequests();
        const leaves = Array.isArray(res?.leaves) ? res.leaves : [];
        if (mounted) setLeaveData(leaves);
      } catch (e) {
        if (!mounted) return;
        setError(e?.response?.data?.message || e.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredData = leaveData.filter((item) => {
    const matchesStatus =
      statusFilter === "All Status" || item.status === statusFilter;
    const matchesSearch =
      (item.employee?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (item.id || "")
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (item.employee?.dept || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = leaveData.filter((item) => item.status === "pending")
    .length;
  const approvedCount = leaveData.filter((item) => item.status === "approved")
    .length;
  const rejectedCount = leaveData.filter((item) => item.status === "rejected")
    .length;


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-1">
        Leave Requests
      </h1>
      <p className="text-gray-500 mb-6">
        Review and manage employee leave requests
      </p>

      {/* Cards */}
      <div className="gap-2 grid grid-cols-1  sm:grid-cols-2  lg:grid-cols-3 mb-6 ">
        {/* Pending */}
        <div className="w-64 bg-white p-5 rounded-2xl shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500">Pending</p>
            <h2 className="text-3xl text-orange-500 font-semibold">
              {pendingCount}
            </h2>
          </div>
          <div className="bg-orange-100 p-3 rounded-xl">
            <FiFilter className="text-orange-500 text-xl" />
          </div>
        </div>

        {/* Approved */}
        <div className="w-64 bg-white p-5 rounded-2xl shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500">Approved</p>
            <h2 className="text-3xl text-green-600 font-semibold">
              {approvedCount}
            </h2>
          </div>
          <div className="bg-green-100 p-3 rounded-xl">
            <FiCheckCircle className="text-green-600 text-xl" />
          </div>
        </div>

        {/* Rejected */}
        <div className=" w-64 bg-white p-5 rounded-2xl shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500">Rejected</p>
            <h2 className="text-3xl text-red-500 font-semibold">
              {rejectedCount}
            </h2>
          </div>
          <div className="bg-red-100 p-3 rounded-xl">
            <FiXCircle className="text-red-500 text-xl" />
          </div>
        </div>
      </div>


      {/* Search + Filter */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow p-6 mb-6 text-gray-600">
          Loading leave requests...
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl shadow p-6 mb-6 text-red-600">
          {error}
        </div>
      ) : (
        <div className="bg-white p-4 rounded-2xl shadow flex gap-4 items-center mb-6">
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl flex-1">
            <FiSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by employee, department, or ID..."
              className="bg-transparent outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setOpenDropdown(!openDropdown)}
              className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl"
            >
              {statusFilter}
              <RiArrowDropDownLine className="text-2xl " />
            </button>

            {openDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow z-50">
                {["All Status", "pending", "approved", "rejected"].map(
                  (status) => (
                    <div
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setOpenDropdown(false);
                      }}
                      className="px-4 py-3 hover:bg-gray-100 rounded-xl mb-2 mt-2 cursor-pointer capitalize"
                    >
                      {status}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-500/40 font-semibold text-gray-800">
          All Leave Requests ({leaveData.length})
        </div>

        {/* Desktop table (lg+) */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-gray-500 text-sm border-b border-gray-500/40">
                <tr>
                  <th className="p-4">Employee Login ID</th>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Date Range</th>
                  <th>Days</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>View</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-500/40 hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <p className="font-medium">{item.employee?.logInID}</p>
                    </td>

                    {/* Employee */}
                    <td>
                      <p className="font-medium">{item.employee?.name}</p>
                      <p className="text-sm text-gray-500">{item.employee?.dept}</p>
                    </td>

                    {/* Leave Type */}
                    <td>
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-sm whitespace-nowrap">
                        {item.leaveType}
                      </span>
                    </td>

                    {/* Date Range */}
                    <td className="whitespace-nowrap">
                      {item.start_date} - {item.end_date}
                    </td>

                    {/* Days */}
                    <td className="whitespace-nowrap">{item.days} days</td>

                    {/* Applied */}
                    <td className="whitespace-nowrap">{item.applied}</td>

                    {/* Status */}
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-sm capitalize ${
                          item.status === "approved"
                            ? "bg-green-100 text-green-600"
                            : item.status === "pending"
                              ? "bg-orange-100 text-orange-500"
                              : "bg-red-100 text-red-500"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedRequest(item);
                          setViewModal(true);
                        }}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="View details"
                        aria-label={`View details for request ${item.id}`}
                      >
                        <FiEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile list (below lg) */}
        <div className="lg:hidden">
          {filteredData.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No leave requests found.</div>
          ) : (
            <div className="divide-y divide-gray-500/40">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">Employee Login ID</p>
                      <p className="font-medium truncate">{item.employee?.logInID}</p>

                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Employee</p>
                        <p className="font-medium truncate">{item.employee?.name}</p>
                        <p className="text-sm text-gray-500 truncate">{item.employee?.dept}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedRequest(item);
                        setViewModal(true);
                      }}
                      className="shrink-0 flex items-center justify-center w-10 h-10 text-blue-600 hover:text-blue-800 bg-blue-50 rounded-xl hover:bg-blue-100"
                      title="View details"
                      aria-label={`View details for request ${item.id}`}
                    >
                      <FiEye />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {item.leaveType}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-sm capitalize ${
                        item.status === "approved"
                          ? "bg-green-100 text-green-600"
                          : item.status === "pending"
                            ? "bg-orange-100 text-orange-500"
                            : "bg-red-100 text-red-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-3 text-sm text-gray-700">
                    <p className="text-gray-500">Date Range</p>
                    <p className="font-medium">
                      {item.start_date} - {item.end_date}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-3">
                      <div>
                        <p className="text-gray-500">Days</p>
                        <p className="font-medium">{item.days} days</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Applied</p>
                        <p className="font-medium">{item.applied}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {viewModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
            {/* Close */}
            <button
              onClick={() => {
                setViewModal(false);
                setSelectedRequest(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-2xl font-semibold mb-2">
              Leave Request Details
            </h2>
            <p className="text-gray-500 mb-6">
              Request ID:{" "}
              <span className="font-semibold">{selectedRequest.id}</span>
            </p>

            {/* Grid Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="font-medium text-gray-700 mb-1">Employee Name</p>
                <p className="text-sm">{selectedRequest.employee?.name}</p>
              </div>

              <div>
                <p className="font-medium text-gray-700 mb-1">Department</p>
                <p className="text-sm">{selectedRequest.employee?.dept}</p>
              </div>

              <div>
                <p className="font-medium text-gray-700 mb-1">Leave Type</p>
                <p className="text-sm capitalize">{selectedRequest.leaveType}</p>
              </div>

              <div>
                <p className="font-medium text-gray-700 mb-1">Number of Days</p>
                <p className="text-sm">{selectedRequest.days} days</p>
              </div>

              <div>
                <p className="font-medium text-gray-700 mb-1">Start Date</p>
                <p className="text-sm">{selectedRequest.start_date}</p>
              </div>

              <div>
                <p className="font-medium text-gray-700 mb-1">End Date</p>
                <p className="text-sm">{selectedRequest.end_date}</p>
              </div>

              <div>
                <p className="font-medium text-gray-700 mb-1">Applied Date</p>
                <p className="text-sm">{selectedRequest.applied}</p>
              </div>


              <div>
                <p className="font-medium text-gray-700 mb-1">Current Status</p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${selectedRequest.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : selectedRequest.status === "pending"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-red-100 text-red-800"
                    }`}
                >
                  {selectedRequest.status}
                </span>
              </div>
            </div>

            {/* Reason */}
            <div className="mb-6">
              <p className="font-medium text-gray-700 mb-3">Reason</p>
              <div className="bg-gray-50 p-4 rounded-xl border">
                Family vacation - traveling to visit relatives
              </div>
            </div>

            {/* Comments */}
            <div className="mb-5">
              <p className="font-medium text-gray-700 mb-3">
                Manager Comments (Optional)
              </p>
              <textarea
                rows="2"
                className="w-full border border-gray-300 rounded-xl p-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                placeholder="Add your comments or notes here..."
                defaultValue=""
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2 ">
              <button
                onClick={() => {
                  setViewModal(false);
                  setSelectedRequest(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors flex-1 sm:flex-none"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    await rejectLeaveRequest(selectedRequest.id, {});
                    const res = await fetchLeaveRequests();
                    setLeaveData(Array.isArray(res?.leaves) ? res.leaves : []);
                    setSelectedRequest(null);
                    setViewModal(false);
                  } catch (e) {
                    alert(e?.response?.data?.message || e.message || "Reject failed");
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors flex-1 sm:flex-none"
              >
                Reject
              </button>

              <button
                onClick={async () => {
                  try {
                    await approveLeaveRequest(selectedRequest.id);
                    const res = await fetchLeaveRequests();
                    setLeaveData(Array.isArray(res?.leaves) ? res.leaves : []);
                    setSelectedRequest(null);
                    setViewModal(false);
                  } catch (e) {
                    alert(e?.response?.data?.message || e.message || "Approve failed");
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition-colors flex-1 sm:flex-none"
              >
                Approve
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
