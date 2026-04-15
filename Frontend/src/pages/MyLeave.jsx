import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import Loader from "../components/Loader"

const filters = ["All", "Pending", "Approved", "Rejected"]

const statusStyles = {
  Pending: "bg-amber-100 text-amber-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
}

const filterStyles = {
  All: "bg-slate-800 text-white",
  Pending: "bg-amber-100 text-amber-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
}

export default function MyLeave() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    const fetchLeaves = async () => {
      if (authLoading || !user) return

      try {
        setLoading(true)
        setError(null)
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:5000/api/leave/my-leaves', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch leaves')
        }

        const data = await response.json()
        setLeaves(data.leaves || [])
      } catch (err) {
        setError(err.message)
        setLeaves([])
      } finally {
        setLoading(false)
      }
    }

    fetchLeaves()
  }, [user, authLoading])

  const filtered = activeFilter === "All"
    ? leaves
    : leaves.filter((l) => l.status === activeFilter)

  return (
    <>
      {/* Page Title */}
      <h1 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">
        My Leave History
      </h1>
      <p className="text-sm text-slate-400 dark:text-slate-500 mb-4 transition-colors duration-300">
        Track all your leave requests in one place
      </p>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap
              ${activeFilter === f
                ? filterStyles[f]
                : "bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-gray-750"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── MOBILE CARD VIEW (shown below md) ── */}
      <div className="flex flex-col gap-3 md:hidden">
        {loading ? (
          <div className="p-8">
            <Loader size="lg" message="Loading your leaves..." />
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-400 bg-white rounded-2xl">
            <p className="text-4xl mb-3">❌</p>
            <p className="text-sm font-medium text-red-600">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 bg-white rounded-2xl">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm font-medium">No {activeFilter} leaves found</p>
          </div>
        ) : (
          filtered.map((row, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm transition-colors duration-300"
            >
              {/* Top row — type + status */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  {row.type}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[row.status]}`}>
                  {row.status}
                </span>
              </div>

              {/* Dates + Days */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  📅 {row.dates}
                </span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                  {row.days} Days
                </span>
              </div>

              {/* Approval Steps */}
              <div>
                <p className="text-xs text-slate-400 mb-1.5 font-medium">
                  Approval Steps
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {row.steps.map((step, j) => (
                    <span
                      key={j}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full
                        ${step.approved
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                        }`}
                    >
                      {step.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── DESKTOP TABLE VIEW (shown on md+) ── */}
      <div className="hidden md:block bg-white dark:bg-gray-800 dark:text-slate-200 rounded-2xl shadow-sm overflow-hidden transition-colors duration-300">
        {loading ? (
          <div className="p-8">
            <Loader size="lg" message="Loading your leaves..." />
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-400">
            <p className="text-4xl mb-3">❌</p>
            <p className="text-sm font-medium text-red-600">{error}</p>
          </div>
        ) : (
          <table className="w-full ">
            <thead>
              <tr className="border-b border-slate-100">
                {["TYPE", "DATES", "DAYS", "APPROVAL STEPS", "STATUS"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-semibold text-slate-400 tracking-wider px-6 py-4"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-50 hover:bg-slate-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {row.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-200 whitespace-nowrap">
                    {row.dates}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-200">
                    {row.days}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {row.steps.map((step, j) => (
                        <span
                          key={j}
                          className={`text-xs font-semibold px-3 py-1 rounded-full
                            ${step.approved
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                            }`}
                        >
                          {step.label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm font-medium">No {activeFilter} leaves found</p>
          </div>
        )}
      </div>
    </>
  )
}