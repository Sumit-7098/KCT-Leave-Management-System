import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import Loader from "../components/Loader"
import { Camera, Pencil, Check, X } from "lucide-react"

export default function Settings() {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState(null)
  const [editValues, setEditValues] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [profileSaved, setProfileSaved] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user && !authLoading) {
      setProfile({
        name: user.fullName,
        email: user.email,
        phone: user.phoneNumber,
        designation: user.designation,
        empId: user.logInID || 'N/A',
        avatar: 'https://i.pravatar.cc/100?img=12' // Static for now
      })
      setEditValues({
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        designation: user.designation
      })
      setLoading(false)
    }
  }, [user, authLoading])

  const handleEditChange = (e) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value })
  }

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editValues)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      // Refresh user data
      const meResponse = await fetch('http://localhost:5000/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const updatedUser = await meResponse.json()

      setProfile({
        name: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phoneNumber,
        designation: updatedUser.designation,
        empId: updatedUser.logInID || 'N/A',
        avatar: profile.avatar
      })
      setIsEditing(false)
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    if (user) {
      setEditValues({
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        designation: user.designation
      })
    }
    setIsEditing(false)
  }

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value })
    setPasswordSaved(false)
    setPasswordError("")
  }

  const handleUpdatePassword = async () => {
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setPasswordError("Please fill all password fields!")
      return
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("New password and confirm password do not match!")
      return
    }
    if (passwords.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters!")
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/user/change-password', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to update password')
      }

      setPasswordError("")
      setPasswordSaved(true)
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setTimeout(() => setPasswordSaved(false), 3000)
    } catch (err) {
      setPasswordError(err.message)
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setProfile(prev => ({ ...prev, avatar: url }))
      setEditValues(prev => ({ ...prev, avatar: url }))
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <Loader size="xl" message="Loading settings..." />
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-100 text-red-600">
        Error: {error}
      </div>
    )
  }

  // Reusable read-only field
  const ReadField = ({ label, value }) => (
    <div>
      <label className="text-xs font-semibold text-blue-500 dark:text-blue-400 mb-1.5 block">{label}</label>
      <div className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-700 text-sm text-slate-700 dark:text-slate-200 select-none">
        {value}
      </div>
    </div>
  )

  // Reusable editable field
  const EditField = ({ label, name, value, type = "text" }) => (
    <div>
      <label className="text-xs font-semibold text-blue-500 dark:text-blue-400 mb-1.5 block">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleEditChange}
        className="w-full px-4 py-2.5 rounded-xl border border-blue-400 dark:border-blue-500 bg-white dark:bg-gray-700 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors duration-200"
      />
    </div>
  )

  return (
    <>
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
        Profile Information
      </h1>
      <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">
        Update your personal details
      </p>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 lg:p-6 shadow-sm mb-6">

        {/* Avatar + Name */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative shrink-0">
            <img
              src={profile.avatar}
              alt="avatar"
              className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover ring-4 ring-slate-100"
            />
            <input
              id="avatarInput"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <button
              onClick={() => document.getElementById("avatarInput").click()}
              className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-colors duration-200"
            >
              <Camera className="w-3 h-3" />
            </button>
          </div>

          <div className="flex-1">
            <h2 className="text-lg lg:text-xl font-bold text-slate-800">
              {profile.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-slate-400">{profile.empId}</span>
            </div>
          </div>

          {/* Edit / Cancel buttons */}
          {!isEditing ? (
            <button
              onClick={() => { setEditValues({ ...profile }); setIsEditing(true) }}
              className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-400 px-3 py-1.5 rounded-xl transition-colors duration-200"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-700 border border-slate-200 hover:border-slate-400 px-3 py-1.5 rounded-xl transition-colors duration-200"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-1 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-xl transition-colors duration-200"
              >
                <Check className="w-3.5 h-3.5" />
                Save
              </button>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {isEditing ? (
            <>
              <EditField label="Name" name="fullName" value={editValues.fullName} />
              <EditField label="Email" name="email" value={editValues.email} type="email" />
              <EditField label="Phone" name="phoneNumber" value={editValues.phoneNumber} />
              <EditField label="Designation" name="designation" value={editValues.designation} />
            </>
          ) : (
            <>
              <ReadField label="Name" value={profile.name} />
              <ReadField label="Email" value={profile.email} />
              <ReadField label="Phone" value={profile.phone} />
              <ReadField label="Designation" value={profile.designation} />
            </>
          )}
        </div>

        {/* Success message */}
        {profileSaved && (
          <div className="mb-4 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
            <p className="text-sm text-emerald-600 font-medium">
              ✅ Profile saved successfully!
            </p>
          </div>
        )}

      </div>

      {/* Change Password Card */}
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm dark:bg-gray-800  ">

        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-1">
          Change Password
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          Update your login password
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div>
            <label className="text-xs font-semibold text-blue-500 mb-1.5 block">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              placeholder="••••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors duration-200"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-blue-500 mb-1.5 block">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              placeholder="••••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors duration-200"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-blue-500 mb-1.5 block">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="••••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors duration-200"
            />
          </div>

        </div>

        {/* Error Message */}
        {passwordError && (
          <div className="mt-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600 font-medium">
              ❌ {passwordError}
            </p>
          </div>
        )}

        {/* Success Message */}
        {passwordSaved && (
          <div className="mt-4 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
            <p className="text-sm text-emerald-600 font-medium">
              ✅ Password updated successfully!
            </p>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={handleUpdatePassword}
            className="w-full md:w-auto bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors duration-200"
          >
            Update Password
          </button>
        </div>

      </div>
    </>
  )
}