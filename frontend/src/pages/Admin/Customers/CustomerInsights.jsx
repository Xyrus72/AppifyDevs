import React, { useEffect, useState } from 'react'
import Modal from '../components/Modal'
import { getAuthHeaders } from '../../../services/authService'

/**
 * Customer Insights Page
 * Features: Display top buyers and their order history
 * Analyze customer behavior and repeat purchase patterns
 */
const CustomerInsights = () => {
  const [topBuyers, setTopBuyers] = useState([])
  const [selectedBuyer, setSelectedBuyer] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [orderHistory, setOrderHistory] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError('')

        const [usersRes, ordersRes] = await Promise.all([
          fetch(`${baseUrl}/api/auth/users`, { headers: getAuthHeaders() }),
          fetch(`${baseUrl}/api/orders?all=true`, { headers: getAuthHeaders() })
        ])

        const [usersJson, ordersJson] = await Promise.all([
          usersRes.ok ? usersRes.json() : { users: [] },
          ordersRes.ok ? ordersRes.json() : { orders: [] }
        ])

        const users = usersJson.users || []
        const orders = ordersJson.orders || ordersJson.data || []

        // Aggregate order stats per customer
        const byUser = new Map()
        orders.forEach(order => {
          if (!order.user || !order.user._id) return
          const userId = order.user._id
          const current = byUser.get(userId) || {
            id: userId,
            name: order.user.name || 'Unknown',
            email: order.user.email || 'Unknown',
            phone: '',
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: null,
            accountCreatedAt: null
          }

          current.totalOrders += 1
          current.totalSpent += order.totalAmount || 0
          const createdAt = order.createdAt ? new Date(order.createdAt) : null
          if (createdAt && (!current.lastOrderDate || createdAt > current.lastOrderDate)) {
            current.lastOrderDate = createdAt
          }

          byUser.set(userId, current)
        })

        // Attach account age from users collection if available
        users.forEach(user => {
          const existing = byUser.get(user._id)
          if (!existing) return
          if (user.createdAt) {
            existing.accountCreatedAt = new Date(user.createdAt)
          }
          existing.phone = user.phone || ''
        })

        const buyersArray = Array.from(byUser.values())

        // Compute repeat rate: simple heuristic based on repeat orders
        buyersArray.forEach(buyer => {
          const repeatOrders = Math.max(buyer.totalOrders - 1, 0)
          const repeatRate = buyer.totalOrders > 0
            ? Math.round((repeatOrders / buyer.totalOrders) * 100)
            : 0
          buyer.repeatRate = repeatRate
          buyer.lastOrderDateString = buyer.lastOrderDate
            ? buyer.lastOrderDate.toISOString()
            : null
          buyer.accountAge = buyer.accountCreatedAt
            ? `${Math.max(
                1,
                Math.round(
                  (Date.now() - buyer.accountCreatedAt.getTime()) / (1000 * 60 * 60 * 24 * 30)
                )
              )} months`
            : 'N/A'
        })

        // Sort by total spent and take top 5
        buyersArray.sort((a, b) => b.totalSpent - a.totalSpent)
        const topFive = buyersArray.slice(0, 5)

        setTopBuyers(topFive)

        // Build order history per top buyer
        const history = {}
        topFive.forEach(buyer => {
          history[buyer.id] = orders
            .filter(o => o.user && o.user._id === buyer.id)
            .map(o => ({
              id: o._id,
              amount: o.totalAmount || 0,
              date: o.createdAt,
              status: o.status,
              items: (o.items || []).length
            }))
        })

        setOrderHistory(history)
      } catch (err) {
        console.error('Error loading customer insights:', err)
        setError(err.message || 'Failed to load customer insights')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleViewDetails = (buyer) => {
    setSelectedBuyer(buyer)
    setIsDetailModalOpen(true)
  }

  const totalRevenue = topBuyers.reduce((sum, buyer) => sum + buyer.totalSpent, 0)
  const totalOrdersAll = topBuyers.reduce((sum, buyer) => sum + buyer.totalOrders, 0)
  const avgOrderValue = totalOrdersAll > 0 ? Math.round(totalRevenue / totalOrdersAll) : 0
  const totalRepeatOrders = topBuyers.reduce((sum, buyer) => sum + Math.max(buyer.totalOrders - 1, 0), 0)

  return (
    <div className="w-full min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-2xl">
        <div className="px-8 py-6">
          <h1 className="text-4xl font-black text-white">👥 Customer Insights</h1>
          <p className="text-gray-400 text-sm mt-2">Analyze your top customers and their purchase patterns</p>
        </div>
      </header>

      {/* Content */}
      <main className="p-8 max-w-7xl mx-auto">
        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl text-sm font-semibold">
            {error}
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-900/40 to-gray-900 p-6 rounded-2xl border border-blue-500/30">
            <p className="text-gray-400 text-sm font-semibold uppercase">Total Top Customers</p>
            <p className="text-5xl font-black text-blue-400 mt-3">{topBuyers.length}</p>
          </div>

          <div className="bg-gradient-to-br from-green-900/40 to-gray-900 p-6 rounded-2xl border border-green-500/30">
            <p className="text-gray-400 text-sm font-semibold uppercase">Revenue from Top 5</p>
            <p className="text-4xl font-black text-green-400 mt-3">
              ৳{totalRevenue.toLocaleString()}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-gray-900 p-6 rounded-2xl border border-purple-500/30">
            <p className="text-gray-400 text-sm font-semibold uppercase">Avg Order Value</p>
            <p className="text-4xl font-black text-purple-400 mt-3">৳{avgOrderValue.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-900/40 to-gray-900 p-6 rounded-2xl border border-orange-500/30">
            <p className="text-gray-400 text-sm font-semibold uppercase">Repeat Orders</p>
            <p className="text-4xl font-black text-orange-400 mt-3">{totalRepeatOrders}</p>
          </div>
        </div>

        {/* Top Buyers Table */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-700 overflow-hidden shadow-lg mb-8">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6 border-b border-gray-700">
            <h3 className="text-2xl font-black text-white">🏆 Top 5 Customers</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800/50 border-b border-gray-700">
                  <th className="px-8 py-4 text-left font-bold text-gray-300 uppercase text-xs tracking-wider">Rank</th>
                  <th className="px-8 py-4 text-left font-bold text-gray-300 uppercase text-xs tracking-wider">Customer Name</th>
                  <th className="px-8 py-4 text-left font-bold text-gray-300 uppercase text-xs tracking-wider">Email</th>
                  <th className="px-8 py-4 text-left font-bold text-gray-300 uppercase text-xs tracking-wider">Total Orders</th>
                  <th className="px-8 py-4 text-left font-bold text-gray-300 uppercase text-xs tracking-wider">Total Spent</th>
                  <th className="px-8 py-4 text-left font-bold text-gray-300 uppercase text-xs tracking-wider">Repeat Rate</th>
                  <th className="px-8 py-4 text-center font-bold text-gray-300 uppercase text-xs tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {topBuyers.map((buyer, idx) => (
                  <tr
                    key={buyer.id}
                    className={`border-b border-gray-800/50 transition duration-300 ${
                      idx % 2 === 0 ? 'bg-gray-900/50' : 'bg-gray-950/50'
                    } hover:bg-gray-800/30`}
                  >
                    <td className="px-8 py-6">
                      <span className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-black px-3 py-1 rounded-full text-sm">
                        #{idx + 1}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold">
                          {buyer.name.charAt(0)}
                        </div>
                        <p className="font-bold text-white">{buyer.name}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-gray-300 text-sm">{buyer.email}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-bold">
                        {buyer.totalOrders} orders
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-green-400">৳{buyer.totalSpent.toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-green-400"
                            style={{ width: `${buyer.repeatRate}%` }}
                          />
                        </div>
                        <span className="text-green-400 font-bold text-sm">{buyer.repeatRate}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button
                        onClick={() => handleViewDetails(buyer)}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition duration-300"
                      >
                        👁️ View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Customer Details Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        title={`👤 ${selectedBuyer?.name} - Customer Profile`}
        onClose={() => setIsDetailModalOpen(false)}
        size="lg"
      >
        {selectedBuyer && (
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-xs uppercase mb-1">Customer Name</p>
                <p className="text-white font-bold text-lg">{selectedBuyer.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase mb-1">Phone</p>
                <p className="text-white font-bold text-lg">
                  {selectedBuyer.phone || 'N/A'}
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <p className="text-gray-400 text-xs uppercase mb-2">Email Address</p>
              <p className="text-gray-300 font-mono text-sm bg-gray-800/30 p-3 rounded-lg">{selectedBuyer.email}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-800/30 rounded-lg">
              <div>
                <p className="text-gray-400 text-xs uppercase mb-2">Total Orders</p>
                <p className="text-2xl font-black text-blue-400">{selectedBuyer.totalOrders}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase mb-2">Total Spent</p>
                <p className="text-2xl font-black text-green-400">
                  ৳{selectedBuyer.totalSpent.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase mb-2">Repeat Rate</p>
                <p className="text-2xl font-black text-purple-400">{selectedBuyer.repeatRate}%</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase mb-2">Account Age</p>
                <p className="text-2xl font-black text-orange-400">{selectedBuyer.accountAge}</p>
              </div>
            </div>

            {/* Order History */}
            <div>
              <p className="text-gray-400 text-xs uppercase mb-3">Recent Orders</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {(orderHistory[selectedBuyer.id] || []).map((order) => (
                  <div key={order.id} className="p-3 bg-gray-800/30 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white text-sm">{order.id}</p>
                      <p className="text-xs text-gray-400">
                        {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-400">৳{order.amount.toLocaleString()}</p>
                      <p className="text-xs text-green-400">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-bold transition duration-300 text-sm">
                📧 Send Email
              </button>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold transition duration-300 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default CustomerInsights
