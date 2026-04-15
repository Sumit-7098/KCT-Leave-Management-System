 import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function RecentRequests() {
  const navigate = useNavigate()
  const { loading: authLoading } = useAuth()
  const [recentLeaves, setRecentLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (authLoading) return

    const fetchRecentLeaves = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:5000/api/leave/my-leaves', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) throw new Error('Failed to fetch recent leaves')

        const data = await response.json()
        setRecentLeaves((data.leaves || []).slice(0, 2))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentLeaves()
  }, [authLoading])

  return (
    <div className="bg-white dark:bg-gray-800  rounded-2xl p-4 lg:p-6 shadow-sm">

      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
          My Recent Request
        </h3>
        <button
          onClick={() => navigate("/my-leave")}
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          View All
        </button>
      </div>

      {/* Scrollable table on mobile */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-125">
          <thead>
            <tr className="border-b border-slate-100 dark:border-gray-700">
              {["TYPE", "DATES", "DAYS", "APPROVAL STEPS", "STATUS"].map((h) => (
                <th key={h} className="text-left text-xs font-semibold text-slate-400 dark:text-slate-200 tracking-wider pb-3 px-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentLeaves.map((req, i) => (
              <tr key={i} className="border-b border-slate-50 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-750 transition-colors duration-200">
                <td className="py-4 px-2 text-sm font-semibold text-slate-700 dark:text-slate-300">{req.type}</td>
                <td className="py-4 px-2 text-sm text-slate-500 dark:text-slate-300 whitespace-nowrap">{req.dates}</td>
                <td className="py-4 px-2 text-sm text-slate-500 dark:text-slate-300">{req.days}</td>
                <td className="py-4 px-2">
                  <div className="flex flex-wrap items-center gap-1">
                    {req.steps.map((step, j) => (
                      <span key={j} className={`text-xs font-semibold px-2 py-1 rounded-full
                        ${step.approved
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                        }`}>
                        {step.label}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full
                    ${req.status === "Approved" ? "bg-emerald-100 text-emerald-700"
                      : req.status === "Rejected" ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"}`}>
                    {req.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}