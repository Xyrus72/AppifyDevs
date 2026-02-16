import React from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, role } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    // Not logged in
    navigate('/signin')
    return null
  }

  if (requiredRole && role !== requiredRole) {
    // Wrong role
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-blue-50 to-slate-100">
        <div className="text-center">
          <h1 className="text-6xl font-black text-red-600 mb-4">❌ Access Denied</h1>
          <p className="text-2xl text-slate-600 mb-8">You don't have permission to access this page</p>
          <p className="text-lg text-slate-500 mb-8">Current Role: <span className="font-bold text-blue-600 capitalize">{role}</span></p>
          <a href="/" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition inline-block">
            Go to Home
          </a>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
