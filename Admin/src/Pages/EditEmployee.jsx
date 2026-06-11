import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteEmployee, fetchEmployees, updateEmployee } from "../api/adminApi";

function useQueryParams(search) {
  return useMemo(() => new URLSearchParams(search || ""), [search]);
}

export default function EditEmployee() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useQueryParams(location.search);

  // We pass employee id from the table as logInID.
  const empId = params.get("id");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    designation: "",
    address: "",
    avatarUrl: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        if (!empId) {
          setError("Missing employee id");
          return;
        }

        setLoading(true);
        setError("");

        // adminApi currently exposes fetchEmployees() only.
        const data = await fetchEmployees();
        const emp = (data?.employees || []).find((e) => String(e.id) === String(empId));

        if (!emp) {
          setError("Employee not found");
          return;
        }

        setForm((prev) => ({
          ...prev,
          fullName: emp.name || "",
          email: emp.email || "",
          designation: emp.dept || "",
          // phoneNumber/address/avatarUrl aren't currently returned by backend list
          phoneNumber: emp.phoneNumber || "",
          address: emp.address || "",
          avatarUrl: emp.avatar || "",
        }));
      } catch (e) {
        setError("Failed to load employee details");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [empId]);

  const onChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const onSave = async () => {
    try {
      setSaving(true);
      setError("");

      const payload = {
        fullName: form.fullName,
        designation: form.designation,
        // email/phone/address are optional; only send when user filled them
        ...(form.email ? { email: form.email } : {}),
        ...(form.phoneNumber ? { phoneNumber: form.phoneNumber } : {}),
        ...(form.address ? { address: form.address } : {}),
        ...(form.avatarUrl ? { avatarUrl: form.avatarUrl } : {}),
      };

      const updated = await updateEmployee(empId, payload);

      // Update succeeded; go back to list
      navigate("/employees");

      return updated;
    } catch (e) {
      setError("Failed to save employee details");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    const ok = window.confirm(`Delete employee ${form.fullName || "?"}?`);
    if (!ok) return;

    try {
      setSaving(true);
      setError("");
      await deleteEmployee(empId);
      navigate("/employees");
    } catch {
      setError("Failed to delete employee");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Edit Employee</h1>
          <p className="text-gray-500">Update employee details</p>
        </div>

        <div className="flex gap-3">
          <button
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-300"
            type="button"
            onClick={() => navigate("/employees")}
          >
            Back
          </button>

          <button
            className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
            type="button"
            onClick={onDelete}
            disabled={saving || loading}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-red-600 font-medium">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Full Name</span>
              <input
                type="text"
                value={form.fullName}
                onChange={onChange("fullName")}
                className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 outline-none"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Department / Designation</span>
              <input
                type="text"
                value={form.designation}
                onChange={onChange("designation")}
                className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 outline-none"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={onChange("email")}
                className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 outline-none"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Phone Number</span>
              <input
                type="text"
                value={form.phoneNumber}
                onChange={onChange("phoneNumber")}
                className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 outline-none"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Address</span>
              <input
                type="text"
                value={form.address}
                onChange={onChange("address")}
                className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 outline-none md:col-span-2"
              />
            </label>

            {/* <label className="block md:col-span-2">
              <span className="text-sm font-medium text-gray-700">Avatar URL</span>
              <input
                type="text"
                value={form.avatarUrl}
                onChange={onChange("avatarUrl")}
                className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 outline-none"
              />
            </label> */}
          </div>
        )}

        <div className="mt-6 flex gap-3 justify-end">
          <button
            type="button"
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-60"
            onClick={onSave}
            disabled={saving || loading}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

