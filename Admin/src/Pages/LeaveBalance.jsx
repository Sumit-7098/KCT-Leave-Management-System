import React, { useEffect, useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { fetchLeaveBalances } from "../api/leaveBalanceAdminApi";

export default function LeaveBalance() {
  const [query, setQuery] = useState("");
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchLeaveBalances();
        if (!mounted) return;
        setBalances(Array.isArray(data?.balances) ? data.balances : []);
      } catch (e) {
        console.error(e);
        if (!mounted) return;
        setError(e?.response?.data?.message || "Failed to load leave balances");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return balances;
    return balances.filter((b) => {
      const name = (b.name || "").toLowerCase();
      const id = (b.id || "").toLowerCase();
      const dept = (b.dept || "").toLowerCase();
      return name.includes(q) || id.includes(q) || dept.includes(q);
    });
  }, [balances, query]);

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800">Leave Balance</h1>
      <p className="text-gray-500 mb-6">Manage employee leave balances</p>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow mb-6">
        <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-xl">
          <FiSearch className="text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, ID, or department..."
            className="bg-transparent outline-none w-full"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="p-4 font-semibold text-gray-700">All Employee Leave Balances ({filtered.length})</div>

        {loading ? (
          <div className="p-6 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="p-6 text-red-600">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No employees found.</div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-gray-500 text-sm border-b border-gray-500/40">
                  <tr>
                    <th className="p-4">Employee</th>
                    <th>Employee ID</th>
                    <th>Department</th>
                    <th>Annual Leave</th>
                    <th>Sick Leave</th>
                    <th>Casual Leave</th>
                    <th>Unpaid Leave</th>
                    <th>Total Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((emp, index) => {
                    const total = Number(emp.total ?? 0);
                    const initials = (emp.name || "")
                      .split(" ")
                      .filter(Boolean)
                      .map((n) => n[0])
                      .join("");

                    return (
                      <tr
                        key={emp.id || index}
                        className="border-b border-gray-500/40 hover:bg-gray-50 transition group"
                      >
                        <td className="p-4 flex items-center gap-3">
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 truncate">{emp.name}</p>
                            <p className="text-sm text-gray-500 truncate">{emp.dept}</p>
                          </div>
                        </td>

                        <td className="whitespace-nowrap">{emp.id}</td>
                        <td className="whitespace-nowrap">{emp.dept}</td>

                        <td>
                          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm whitespace-nowrap">
                            {emp.annual} days
                          </span>
                        </td>
                        <td>
                          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm whitespace-nowrap">
                            {emp.sick} days
                          </span>
                        </td>
                        <td>
                          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm whitespace-nowrap">
                            {emp.casual} days
                          </span>
                        </td>
                        <td>
                          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm whitespace-nowrap">
                            {emp.unpaid} days
                          </span>
                        </td>

                        <td>
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm whitespace-nowrap">
                            {total} days
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile List */}
            <div className="lg:hidden divide-y divide-gray-500/40">
              {filtered.map((emp, index) => {
                const total = Number(emp.total ?? 0);
                const initials = (emp.name || "")
                  .split(" ")
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join("");

                return (
                  <div key={emp.id || index} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate">{emp.name}</p>
                          <p className="text-sm text-gray-500 truncate">{emp.dept}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">ID</div>
                        <div className="font-semibold text-gray-800 whitespace-nowrap">{emp.id}</div>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Annual: {emp.annual}</span>
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Sick: {emp.sick}</span>
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Casual: {emp.casual}</span>
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Unpaid: {emp.unpaid}</span>
                    </div>

                    <div className="mt-3">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Total: {total} days</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

