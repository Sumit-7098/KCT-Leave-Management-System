import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import Loader from "../components/Loader"
import StatsCards from "../components/StatsCards"
import ApprovalBanner from "../components/ApprovalBanner"
import RecentRequests from "../components/RecentRequests"

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:5000/api/user/leave-balance', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) throw new Error('Failed to fetch dashboard data')

        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <Loader size={56} message="Loading dashboard..." />
    </div>
  )
  if (error) return <div className="text-center py-16 text-red-500">Error: {error}</div>
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">
        Welcome {user?.fullName || 'User'}!
      </h1>
      <p className="text-sm text-slate-400 dark:text-slate-500 mb-5 transition-colors duration-300">
        Your leave overview 2026
      </p>
      <StatsCards stats={stats} />
      <ApprovalBanner />
      <RecentRequests />
    </>
  )
}
