import React from 'react'
import { useAuth } from '../../context/AuthContext'
import CustomerDashboard from './CustomerDashboard'
import { useNavigate } from 'react-router-dom'

/**
 * Generic Dashboard entry.
 * Redirects unauthenticated users to sign-in and shows the customer dashboard
 * for non-admin users. Admins are redirected immediately after login, so they
 * normally won't hit this route.
 */
const Dashboard = () => {
  const { user, role } = useAuth()
  const navigate = useNavigate()

  // If no user, redirect to signin
  if (!user) {
    navigate('/signin')
    return null
  }

  // If somehow an admin lands here, send them to admin dashboard
  if (role === 'admin') {
    navigate('/admin/dashboard')
    return null
  }

  return <CustomerDashboard />
}

export default Dashboard
