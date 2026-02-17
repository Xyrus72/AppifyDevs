import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Admin Layout Component
 * Main wrapper for all admin pages with navigation sidebar
 * Provides consistent layout and navigation across admin sections
 */
const AdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/signin')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const adminMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/admin/dashboard',
      description: 'View overall metrics and analytics'
    },
    {
      id: 'products',
      label: 'Products',
      icon: '📦',
      path: '/admin/products',
      description: 'Manage product catalog'
    }
    ,
    {
      id: 'orders',
      label: 'Orders',
      icon: '📬',
      path: '/admin/orders',
      description: 'Manage orders'
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: '👥',
      path: '/admin/customers',
      description: 'View customer insights'
    }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="w-full min-h-screen bg-gray-950 text-white flex">
      {/* Left Sidebar Navigation */}
      <aside className="w-72 bg-gradient-to-b from-gray-900 to-gray-950 border-r border-gray-800 sticky top-0 h-screen overflow-y-auto">
        {/* Logo Area */}
        <div className="p-6 border-b border-gray-800">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-3xl font-black text-transparent bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text mb-2 hover:opacity-80 transition duration-300"
          >
            🛍️ ADMIN
          </button>
          <p className="text-gray-400 text-xs">E-commerce Control Center</p>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {adminMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full text-left px-4 py-3 rounded-lg transition duration-300 group ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-red-600/30 to-pink-600/30 border border-red-500/50'
                  : 'hover:bg-gray-800/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl">{item.icon}</span>
                <span className={`font-bold ${isActive(item.path) ? 'text-red-400' : 'text-gray-300 group-hover:text-white'}`}>
                  {item.label}
                </span>
              </div>
              <p className="text-xs text-gray-500 ml-11">{item.description}</p>
            </button>
          ))}
        </nav>

        {/* Footer - User Info & Logout */}
        <div className="absolute bottom-0 left-0 w-72 p-4 bg-gradient-to-t from-gray-950 via-gray-950 to-transparent border-t border-gray-800 space-y-3">
          {/* User Info */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
            <p className="text-gray-400 text-xs font-bold mb-1">👤 Logged in as</p>
            <p className="text-white text-sm font-semibold truncate">{user?.email || 'Admin'}</p>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
