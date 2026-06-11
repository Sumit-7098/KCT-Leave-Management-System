import React, { useEffect, useMemo, useState } from "react";
import { FiSearch, FiFilter, FiCheck, FiEdit, FiTrash2 } from "react-icons/fi";
import { RiArrowDropDownLine } from "react-icons/ri";
import { deleteEmployee, fetchEmployees } from "../api/adminApi";
import { useNavigate } from "react-router-dom";

export default function EmployeeManagement() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchEmployees();
        setEmployees(data?.employees || []);
      } catch (e) {
        setError("Failed to load employees");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const departments = useMemo(() => {
    const depts = Array.from(new Set(employees.map((e) => e.dept).filter(Boolean)));
    return ["All Departments", ...depts];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    const byDept =
      selectedDept === "All Departments"
        ? employees
        : employees.filter((emp) => emp.dept === selectedDept);

    const q = searchTerm.trim().toLowerCase();
    if (!q) return byDept;

    return byDept.filter((emp) => {
      return (
        (emp.name || "").toLowerCase().includes(q) ||
        (emp.email || "").toLowerCase().includes(q) ||
        (String(emp.id) || "").toLowerCase().includes(q)
      );
    });
  }, [employees, selectedDept, searchTerm]);

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5 sm:mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">Employee Management</h1>
          <p className="text-gray-500">Manage all employees and their information</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl shadow flex flex-col md:flex-row md:items-center gap-3 mb-5 sm:mb-6">
        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl flex-1">
          <FiSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none w-full"
          />
        </div>

        {/* Dropdown Filter */}
        <div className="relative w-full md:w-auto">
          <button
            onClick={() => setOpen(!open)}
            className="w-full md:w-auto flex items-center justify-between md:justify-start gap-4 bg-gray-100 px-4 py-2 rounded-xl hover:bg-gray-200"
          >
            <span className="flex items-center gap-3">
              <FiFilter className="shrink-0" />
              <span className="truncate max-w-[160px] sm:max-w-[220px]">{selectedDept}</span>
            </span>
            <RiArrowDropDownLine className="text-2xl shrink-0" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-64 sm:w-60 max-h-[70vh] overflow-auto bg-white rounded-xl shadow-lg z-50">
              {departments.map((dept) => (
                <div
                  key={dept}
                  onClick={() => {
                    setSelectedDept(dept);
                    setOpen(false);
                  }}
                  className={`flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-100 rounded-xl mb-2 last:mb-0 ${
                    selectedDept === dept ? "bg-gray-100 font-medium" : ""
                  }`}
                >
                  <span className="truncate pr-3">{dept}</span>
                  {selectedDept === dept && <FiCheck className="text-gray-600 shrink-0" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 sm:px-6 py-4 border-b border-gray-500/40">
          <div className="w-1 h-6 bg-blue-600 rounded"></div>
          <h2 className="font-semibold text-gray-800 text-base sm:text-lg">
            All Employees ({filteredEmployees.length})
          </h2>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-gray-500 text-sm border-b border-gray-500/40">
              <tr>
                <th className="p-4">Name</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Address</th>
                <th>Phone Number</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    Loading employees...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-red-600">
                    {error}
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    No employees found.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="group border-b border-gray-500/40 hover:bg-gray-50 transition"
                  >
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold shrink-0">
                        {emp.avatar ? (
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          emp.initials
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate">{emp.name}</p>
                        <p className="text-sm text-gray-500 truncate">{emp.email}</p>
                      </div>
                    </td>

                    <td className="whitespace-nowrap">{emp.id}</td>

                    <td>
                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm whitespace-nowrap">
                        {emp.dept}
                      </span>
                    </td>

                    <td className="text-sm max-w-[260px]">
                      <div className="truncate">{emp.address}</div>
                    </td>

                    <td className="whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-md bg-gray-50 border border-gray-200 inline-block">
                        {emp.phoneNumber}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="p-2 whitespace-nowrap">
                      <div className="flex gap-3 justify-end">
                        <button
                          type="button"
                          className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200"
                          onClick={() => {
                            navigate(`/employees/edit?id=${encodeURIComponent(emp.id)}`);
                          }}
                          aria-label={`Edit employee ${emp.name}`}
                        >
                          <FiEdit />
                        </button>

                        <button
                          type="button"
                          className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200"
                          onClick={async () => {
                            const ok = window.confirm(`Delete employee: ${emp.name}?`);
                            if (!ok) return;

                            await deleteEmployee(emp.id);
                            setEmployees((prev) => prev.filter((x) => x.id !== emp.id));
                          }}
                          aria-label={`Delete employee ${emp.name}`}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile List */}
        <div className="lg:hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading employees...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-600">{error}</div>
          ) : filteredEmployees.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No employees found.</div>
          ) : (
            <div className="divide-y divide-gray-500/40">
              {filteredEmployees.map((emp) => (
                <div
                  key={emp.id}
                  className="p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold shrink-0">
                      {emp.avatar ? (
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        emp.initials
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate">{emp.name}</p>
                          <p className="text-sm text-gray-500 truncate">{emp.email}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">ID</div>
                          <div className="font-semibold text-gray-800 whitespace-nowrap">{emp.id}</div>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                          {emp.dept}
                        </span>
                        <span className="text-sm bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
                          {emp.phoneNumber}
                        </span>
                      </div>

                      <div className="mt-3 text-sm text-gray-700">
                        <span className="text-gray-500">Address: </span>
                        <span className="break-words">{emp.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3 justify-end">
                    <button
                      type="button"
                      className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200"
                      onClick={() => {
                        navigate(`/employees/edit?id=${encodeURIComponent(emp.id)}`);
                      }}
                      aria-label={`Edit employee ${emp.name}`}
                    >
                      <FiEdit />
                    </button>

                    <button
                      type="button"
                      className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200"
                      onClick={async () => {
                        const ok = window.confirm(`Delete employee: ${emp.name}?`);
                        if (!ok) return;

                        await deleteEmployee(emp.id);
                        setEmployees((prev) => prev.filter((x) => x.id !== emp.id));
                      }}
                      aria-label={`Delete employee ${emp.name}`}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

