import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

const CustomerDashboard = () => {
  const { user, logout } = useAuth()

  return (
    <div className="w-full bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-cyan-600/20 via-blue-600/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900/40 to-black border-b border-blue-500/20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-8 py-20 flex justify-between items-center relative z-10">
          <div className="flex-1">
            <h1 className="text-7xl font-black mb-4 text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text drop-shadow-lg">Dashboard</h1>
            <p className="text-xl text-gray-300">Welcome back, <span className="font-bold text-cyan-400">{user?.name || 'Customer'}</span>! 👋</p>
          </div>
          <button
            onClick={logout}
            className="relative group px-8 py-4 rounded-xl font-semibold overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 group-hover:from-red-500 group-hover:to-red-600 transition duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 blur group-hover:blur-lg opacity-50 transition duration-300"></div>
            <span className="relative flex items-center gap-2">🚪 Logout</span>
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '📦', label: 'Total Orders', value: '12', color: 'from-blue-500 to-cyan-500' },
              { icon: '💰', label: 'Total Spent', value: '$2,459', color: 'from-green-500 to-emerald-500' },
              { icon: '🚚', label: 'Active Orders', value: '8', color: 'from-purple-500 to-pink-500' },
              { icon: '⭐', label: 'Member Status', value: 'Premium', color: 'from-yellow-500 to-orange-500' }
            ].map((stat, idx) => (
              <div key={idx} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition duration-500 rounded-2xl" style={{backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`}}></div>
                <div className={`relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 group-hover:border-blue-500/50 rounded-2xl p-8 transition duration-300 transform group-hover:-translate-y-1 group-hover:shadow-2xl`}>
                  <div className={`text-5xl mb-4 transform group-hover:scale-125 transition duration-300`}>{stat.icon}</div>
                  <p className="text-gray-400 text-sm font-semibold mb-2">{stat.label}</p>
                  <p className={`text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black mb-8 text-white">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/products" className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-gray-900/80 to-black border border-gray-800 group-hover:border-blue-500/30 rounded-2xl p-8 backdrop-blur-sm transition duration-300 hover:shadow-2xl">
                <div className="text-6xl mb-4 group-hover:scale-110 transition duration-300">🛍️</div>
                <h3 className="text-2xl font-bold mb-2 text-white">Shop Products</h3>
                <p className="text-gray-400 mb-6">Browse our amazing collection</p>
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-3 rounded-lg font-bold transition transform hover:scale-105 shadow-lg">
                  View Products →
                </button>
              </div>
            </Link>
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-gray-900/80 to-black border border-gray-800 group-hover:border-blue-500/30 rounded-2xl p-8 backdrop-blur-sm transition duration-300 hover:shadow-2xl">
                <div className="text-6xl mb-4 group-hover:scale-110 transition duration-300">📦</div>
                <h3 className="text-2xl font-bold mb-2 text-white">View Orders</h3>
                <p className="text-gray-400 mb-6">Track and manage all your purchases</p>
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-3 rounded-lg font-bold transition transform hover:scale-105 shadow-lg">
                  My Orders →
                </button>
              </div>
            </div>
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-gray-900/80 to-black border border-gray-800 group-hover:border-blue-500/30 rounded-2xl p-8 backdrop-blur-sm transition duration-300 hover:shadow-2xl">
                <div className="text-6xl mb-4 group-hover:scale-110 transition duration-300">⚙️</div>
                <h3 className="text-2xl font-bold mb-2 text-white">Settings</h3>
                <p className="text-gray-400 mb-6">Manage your account preferences</p>
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-3 rounded-lg font-bold transition transform hover:scale-105 shadow-lg">
                  Settings →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Orders */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black mb-8 text-white">Recent Orders</h2>
          <div className="space-y-4">
            {[
              { id: 'OD-2957', product: 'Premium Laptop', date: 'Feb 10, 2026', status: 'In Transit', color: 'blue' },
              { id: 'OD-2945', product: 'Wireless Headphones', date: 'Feb 08, 2026', status: 'Delivered', color: 'green' },
              { id: 'OD-2932', product: 'USB-C Cable Pack', date: 'Feb 05, 2026', status: 'Delivered', color: 'purple' },
              { id: 'OD-2918', product: 'Phone Case & Screen Protector', date: 'Jan 28, 2026', status: 'Delivered', color: 'orange' }
            ].map((order, idx) => (
              <div key={idx} className={`group bg-gradient-to-r from-${order.color}-500/10 to-${order.color}-600/5 border-l-4 border-${order.color}-500 p-6 rounded-lg hover:shadow-2xl transition backdrop-blur-sm hover:bg-opacity-20 cursor-pointer`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-lg font-bold text-white">Order <span className={`text-${order.color}-400`}>#{order.id}</span></p>
                    <p className="text-gray-300 font-medium mt-1">{order.product}</p>
                    <p className="text-gray-500 text-sm mt-3">📅 {order.date}</p>
                  </div>
                  <span className={`bg-gradient-to-r from-${order.color}-600 to-${order.color}-700 text-white px-6 py-2 rounded-lg font-bold whitespace-nowrap ml-4`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section className="py-16 px-8 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-600/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 blur-lg opacity-50 group-hover:opacity-75 transition duration-300 rounded-3xl"></div>
            <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white p-12 rounded-3xl border border-green-500/50 overflow-hidden shadow-2xl">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10">
                <h3 className="text-4xl font-black mb-4">🎁 Loyalty Rewards</h3>
                <p className="text-xl mb-2">You have earned</p>
                <p className="text-5xl font-black mb-6">1,250 Points</p>
                <p className="text-green-100 text-lg mb-8">Redeem for exclusive discounts and premium products!</p>
                <button className="bg-white text-green-600 px-10 py-4 rounded-xl font-bold hover:bg-green-50 transition text-lg transform hover:scale-105 shadow-lg">
                  🎉 Redeem Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Spacing */}
      <div className="h-20"></div>
    </div>
  )
}

export default CustomerDashboard
