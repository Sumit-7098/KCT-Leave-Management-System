import React, { useEffect, useMemo, useState } from "react";
import Chart from "../Components/Chart";
import PieChartDept from "../Components/PieChartDept";
import RecentActivity from "../Components/RecentActivity";
import { FaUsers, FaFileAlt, FaClock, FaCheck } from "react-icons/fa";
import { fetchEmployees } from "../api/adminApi";
import { fetchLeaveRequests } from "../api/leaveAdminApi";

export default function Layout() {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminProfile, setAdminProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const stats = useMemo(() => {
    const totalEmployees = employees.length;

    const totalLeaves = leaves.length;
    const pending = leaves.filter((l) => l?.status === "pending").length;
    const approved = leaves.filter((l) => l?.status === "approved").length;

    return { totalEmployees, totalLeaves, pending, approved };
  }, [employees, leaves]);

  const monthlyChartData = useMemo(() => {
    // Build month buckets from appliedDate (leave.createdAt)
    const buckets = new Map(); // key: YYYY-MM => count
    for (const l of leaves) {
      const d = l?.appliedDate ? new Date(l.appliedDate) : null;
      if (!d || Number.isNaN(d.getTime())) continue;

      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      buckets.set(key, (buckets.get(key) || 0) + 1);
    }

    // Convert to sorted array
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const sortedKeys = Array.from(buckets.keys()).sort();

    return sortedKeys.map((key) => {
      const [yearStr, monthStr] = key.split("-");
      const monthIdx = Number(monthStr) - 1;
      const name = `${monthNames[monthIdx] || "—"}`;
      return { name, value: buckets.get(key) || 0 };
    });
  }, [leaves]);

  const departmentPieData = useMemo(() => {
    const counts = new Map(); // dept => count
    for (const e of employees) {
      const dept = e?.dept || "Unknown";
      counts.set(dept, (counts.get(dept) || 0) + 1);
    }

    const palette = ["#2563eb", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#22c55e"];
    const entries = Array.from(counts.entries()).map(([name, value], idx) => ({
      name,
      value,
      color: palette[idx % palette.length],
    }));

    // Sort descending for nicer pie
    entries.sort((a, b) => b.value - a.value);
    return entries;
  }, [employees]);

  const recentActivities = useMemo(() => {
    const sorted = [...leaves]
      .slice()
      .sort((a, b) => {
        const da = a?.appliedDate ? new Date(a.appliedDate).getTime() : 0;
        const db = b?.appliedDate ? new Date(b.appliedDate).getTime() : 0;
        return db - da;
      });

    const toTime = (l) => {
      if (l?.applied) return l.applied; // already formatted by backend (en-GB)
      const d = l?.appliedDate ? new Date(l.appliedDate) : null;
      if (!d || Number.isNaN(d.getTime())) return "";
      return d.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    };

    return sorted.slice(0, 5).map((l) => {
      const leaveType = l?.leaveType || "Leave";
      const days = l?.days ?? 0;
      const empName = l?.employee?.name || "";
      const status = l?.status;

      if (status === "approved") {
        return {
          name: empName,
          time: toTime(l),
          type: "approved",
          action: `${leaveType} request approved${days ? ` (${days} days)` : ""}`,
        };
      }

      if (status === "rejected") {
        return {
          name: empName,
          time: toTime(l),
          type: "rejected",
          action: `${leaveType} request rejected${days ? ` (${days} days)` : ""}`,
        };
      }

      // default -> pending request
      return {
        name: empName,
        time: toTime(l),
        type: "request",
        action: `applied for ${leaveType}${days ? ` (${days} days)` : ""}`,
      };
    });
  }, [leaves]);

  useEffect(() => {
    // Load admin profile for dashboard greeting
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setAdminProfile(data);
      } catch (e) {
        setAdminProfile(null);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);
  
  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const [empRes, leaveRes] = await Promise.all([
          fetchEmployees(),
          fetchLeaveRequests(),
        ]);

        if (!isMounted) return;

        setEmployees(Array.isArray(empRes?.employees) ? empRes.employees : []);
        setLeaves(Array.isArray(leaveRes?.leaves) ? leaveRes.leaves : []);
      } catch (e) {
        console.error(e);
        if (!isMounted) return;
        setError("Failed to load dashboard stats");
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const cardValue = (num) => (loading ? "—" : String(num));

  return (
    <div className="bg-gray-100 min-h-0">
      {/* Main Content */}
      <div className="p-6 min-h-0">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 mb-8">
          Welcome back,{" "}
          {loadingProfile
            ? "..."
            : (adminProfile?.fullName || adminProfile?.name || "Admin")}!
          Here's what's happening today.
        </p>

        {error ? (
          <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </div>
        ) : null}

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card
            title="Total Employees"
            value={cardValue(stats.totalEmployees)}
            note="+ this month"
            color="blue"
            icon={<FaUsers />}
          />
          <Card
            title="Total Leaves"
            value={cardValue(stats.totalLeaves)}
            note="This month"
            color="purple"
            icon={<FaFileAlt />}
          />
          <Card
            title="Pending Requests"
            value={cardValue(stats.pending)}
            note="Needs action"
            color="orange"
            icon={<FaClock />}
          />
          <Card
            title="Approved Leaves"
            value={cardValue(stats.approved)}
            note="This month"
            color="green"
            icon={<FaCheck />}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Line Chart */}
          <Chart data={monthlyChartData} />

          {/* Pie Chart */}
          <PieChartDept data={departmentPieData} />
        </div>
        <RecentActivity activities={recentActivities} />
      </div>
    </div>
  );
}

/* Card Component */
function Card({ title, value, note, icon, color }) {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
    green: "from-green-500 to-green-600",
  };

  const textColors = {
    blue: "text-blue-500",
    purple: "text-purple-500",
    orange: "text-orange-500",
    green: "text-green-500",
  };

  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-md flex justify-between items-center hover:shadow-lg transition">
      {/* Left */}
      <div>
        <p className="text-gray-600 font-medium mb-2">{title}</p>
        <h2 className="text-4xl font-bold text-gray-800">{value}</h2>
        <p className={`text-sm mt-2 ${textColors[color]}`}>{note}</p>
      </div>

      {/* Icon */}
      <div
        className={`bg-linear-to-r ${colors[color]} text-white p-4 rounded-2xl text-xl shadow-md`}
      >
        {icon}
      </div>
    </div>
  );
}
