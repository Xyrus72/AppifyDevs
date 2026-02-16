import React from 'react'
import { useAuth } from '../../context/AuthContext'

const AdminDashboard = () => {
  const { user, logout } = useAuth()

  return (
    <div className="w-full bg-gray-950 text-white">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white py-24 px-8 border-b border-gray-800 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto flex justify-between items-center relative z-10">
          <div>
            <h1 className="text-6xl font-black mb-3 text-transparent bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text">Admin Dashboard</h1>
            <p className="text-xl text-gray-300">Manage your platform with ease</p>
          </div>
          <div className="text-right">
            <p className="text-lg mb-4 text-gray-300">Welcome, <span className="font-bold capitalize text-red-400">{user?.name}</span>! 👑</p>
            <button
              onClick={logout}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-8 py-3 rounded-lg font-bold transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </section>

      {/* Admin Stats */}
      <section className="py-20 px-8 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black mb-12 text-white">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-blue-500 transition transform hover:-translate-y-2">
              <div className="text-5xl font-black text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-3">2,547</div>
              <p className="text-gray-400 font-semibold text-lg">Total Users</p>
            </div>
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-green-500 transition transform hover:-translate-y-2">
              <div className="text-5xl font-black text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text mb-3">$89.5K</div>
              <p className="text-gray-400 font-semibold text-lg">Total Revenue</p>
            </div>
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-purple-500 transition transform hover:-translate-y-2">
              <div className="text-5xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-3">1,203</div>
              <p className="text-gray-400 font-semibold text-lg">Active Orders</p>
            </div>
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-orange-500 transition transform hover:-translate-y-2">
              <div className="text-5xl font-black text-transparent bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text mb-3">98.7%</div>
              <p className="text-gray-400 font-semibold text-lg">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Controls */}
      <section className="py-20 px-8 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black mb-12 text-white">Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 p-10 rounded-2xl border border-gray-700 hover:border-blue-500 transition transform hover:-translate-y-2 shadow-lg">
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition">📦</div>
              <h3 className="text-2xl font-black mb-3 text-white">Manage Products</h3>
              <p className="text-gray-400 mb-6">Add, edit, or remove products from your store</p>
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-3 rounded-lg font-bold transition transform hover:scale-105">
                Go to Products
              </button>
            </div>
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 p-10 rounded-2xl border border-gray-700 hover:border-green-500 transition transform hover:-translate-y-2 shadow-lg">
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition">👥</div>
              <h3 className="text-2xl font-black mb-3 text-white">Manage Users</h3>
              <p className="text-gray-400 mb-6">View and manage customer accounts and permissions</p>
              <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white py-3 rounded-lg font-bold transition transform hover:scale-105">
                Go to Users
              </button>
            </div>
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 p-10 rounded-2xl border border-gray-700 hover:border-purple-500 transition transform hover:-translate-y-2 shadow-lg">
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition">📊</div>
              <h3 className="text-2xl font-black mb-3 text-white">View Reports</h3>
              <p className="text-gray-400 mb-6">Analyze sales, traffic, and customer insights</p>
              <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white py-3 rounded-lg font-bold transition transform hover:scale-105">
                Go to Reports
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activities */}
      <section className="py-20 px-8 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black mb-12 text-white">Recent Activities</h2>
          <div className="space-y-4">
            <div className="bg-blue-500/10 border-l-4 border-blue-500 p-6 rounded-lg backdrop-blur-sm">
              <p className="text-gray-300"><span className="font-bold text-blue-400">New Order</span> - Customer placed order #OD-2947 for $429.99</p>
              <p className="text-gray-500 text-sm mt-2">2 hours ago</p>
            </div>
            <div className="bg-green-500/10 border-l-4 border-green-500 p-6 rounded-lg backdrop-blur-sm">
              <p className="text-gray-300"><span className="font-bold text-green-400">Payment Received</span> - $1,245.50 received from multiple customers</p>
              <p className="text-gray-500 text-sm mt-2">4 hours ago</p>
            </div>
            <div className="bg-purple-500/10 border-l-4 border-purple-500 p-6 rounded-lg backdrop-blur-sm">
              <p className="text-gray-300"><span className="font-bold text-purple-400">New User Registered</span> - 3 new customers signed up today</p>
              <p className="text-gray-500 text-sm mt-2">6 hours ago</p>
            </div>
            <div className="bg-orange-500/10 border-l-4 border-orange-500 p-6 rounded-lg backdrop-blur-sm">
              <p className="text-gray-300"><span className="font-bold text-orange-400">Stock Alert</span> - "Premium Headphones" inventory low (5 units)</p>
              <p className="text-gray-500 text-sm mt-2">1 day ago</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdminDashboard
