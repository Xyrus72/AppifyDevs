import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MetricsCard from './components/MetricsCard'
import RevenueChart from './components/RevenueChart'
import { getAuthHeaders } from '../../services/authService'

/**
 * Enhanced Admin Dashboard
 * Main dashboard showing key metrics and quick access to all admin sections
 * Features: Revenue chart, sales metrics, profit calculation, expected income
 */
const AdminDashboardEnhanced = () => {
  const navigate = useNavigate()
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')

  const [metrics, setMetrics] = useState({
    monthlyRevenue: 0,
    soldQuantity: 0,
    totalSales: 0,
    profit: 0,
    expectedIncome: 0,
    revenueChange: 0,
    quantityChange: 0,
    salesChange: 0,
    profitChange: 0,
    expectedChange: 0
  })

  const [chartData, setChartData] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load real data from backend (users, orders, products)
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError('')

        const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

        const [ordersRes, productsRes, usersRes] = await Promise.all([
          fetch(`${baseUrl}/api/orders?all=true`, { headers: getAuthHeaders() }),
          fetch(`${baseUrl}/api/products?active=false`, { headers: { 'Content-Type': 'application/json' } }),
          fetch(`${baseUrl}/api/auth/users`, { headers: getAuthHeaders() })
        ])

        const [ordersJson, productsJson, usersJson] = await Promise.all([
          ordersRes.ok ? ordersRes.json() : { orders: [] },
          productsRes.ok ? productsRes.json() : { products: [] },
          usersRes.ok ? usersRes.json() : { users: [] }
        ])

        const orders = ordersJson.orders || ordersJson.data || []
        const products = productsJson.products || []
        const users = usersJson.users || []

        // Basic metrics from real orders
        const totalSales = orders.length
        const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
        const soldQuantity = orders.reduce(
          (sum, o) => sum + (o.items || []).reduce((s, item) => s + (item.quantity || 0), 0),
          0
        )

        // Simple profit approximation: 40% margin
        const profit = Math.round(totalRevenue * 0.4)
        const expectedIncome = totalRevenue

        setMetrics(prev => ({
          ...prev,
          monthlyRevenue: totalRevenue,
          soldQuantity,
          totalSales,
          profit,
          expectedIncome
        }))

        // Build simple chart data from orders by month
        const revenueByMonth = new Map()
        orders.forEach(order => {
          const createdAt = order.createdAt ? new Date(order.createdAt) : new Date()
          const monthKey = createdAt.toLocaleString('en-US', { month: 'short' })
          revenueByMonth.set(monthKey, (revenueByMonth.get(monthKey) || 0) + (order.totalAmount || 0))
        })

        const chartDataFromOrders = Array.from(revenueByMonth.entries()).map(([month, revenue]) => ({
          month,
          revenue
        }))

        setChartData(chartDataFromOrders)

        // Recent orders list (limit to 5)
        setRecentOrders(orders.slice(0, 5))
      } catch (err) {
        console.error('Error loading admin dashboard data:', err)
        setError('Failed to load dashboard data from server.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const adminSections = [
    {
      id: 'products',
      title: '📦 Products',
      description: 'Manage product catalog',
      icon: '📦',
      path: '/admin/products',
      color: 'from-blue-600 to-blue-700'
    },
    {
      id: 'orders',
      title: '📬 Orders',
      description: 'Manage orders & approvals',
      icon: '📬',
      path: '/admin/orders',
      color: 'from-green-600 to-green-700'
    },
    {
      id: 'customers',
      title: '👥 Customers',
      description: 'View customer insights',
      icon: '👥',
      path: '/admin/customers',
      color: 'from-cyan-600 to-cyan-700'
    }
  ]

  return (
    <div className="w-full min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-2xl">
        <div className="px-8 py-6">
          <h1 className="text-4xl font-black text-transparent bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text">📊 Admin Dashboard</h1>
          <p className="text-gray-400 text-sm mt-2">Monitor your ecommerce business performance</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8 max-w-7xl mx-auto">
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl text-sm font-semibold">
            {error}
          </div>
        )}
        {/* Period Selector */}
        <div className="mb-8 flex gap-4">
          {['daily', 'weekly', 'monthly', 'yearly'].map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-6 py-2 rounded-lg font-bold uppercase text-xs transition duration-300 ${
                selectedPeriod === period
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <MetricsCard
            title="Total Revenue"
            value={metrics.monthlyRevenue}
            icon="💰"
            change={metrics.revenueChange}
            isPositive={true}
            currency={true}
            backgroundColor="from-blue-600 to-blue-700"
          />
          <MetricsCard
            title="Items Sold"
            value={metrics.soldQuantity}
            icon="📊"
            change={metrics.quantityChange}
            isPositive={true}
            backgroundColor="from-green-600 to-green-700"
          />
          <MetricsCard
            title="Total Orders"
            value={metrics.totalSales}
            icon="🛒"
            change={metrics.salesChange}
            isPositive={true}
            backgroundColor="from-purple-600 to-purple-700"
          />
          <MetricsCard
            title="Estimated Profit"
            value={metrics.profit}
            icon="💵"
            change={metrics.profitChange}
            isPositive={true}
            currency={true}
            backgroundColor="from-orange-600 to-orange-700"
          />
          <MetricsCard
            title="Expected Income"
            value={metrics.expectedIncome}
            icon="📈"
            change={metrics.expectedChange}
            isPositive={true}
            currency={true}
            backgroundColor="from-pink-600 to-pink-700"
          />
        </div>

        {/* Revenue Chart */}
        <div className="mb-12">
          <RevenueChart data={chartData} />
        </div>

        {/* Admin Sections Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-white mb-8">🎯 Admin Sections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminSections.map(section => (
              <button
                key={section.id}
                onClick={() => navigate(section.path)}
                className={`bg-gradient-to-br ${section.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 group text-left`}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition duration-300">{section.icon}</div>
                <h3 className="text-xl font-black mb-2">{section.title}</h3>
                <p className="text-sm opacity-90">{section.description}</p>
                <div className="mt-4 text-xs font-bold opacity-75">Click to manage →</div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Orders (real data) */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-8 border border-gray-700 shadow-lg">
          <h3 className="text-2xl font-black text-white mb-6">📝 Recent Orders</h3>
          {loading ? (
            <div className="p-6 text-gray-400">Loading orders...</div>
          ) : recentOrders.length === 0 ? (
            <div className="p-6 text-gray-400">No orders found in the database yet.</div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition duration-300"
                >
                  <div className="text-gray-400 text-sm font-semibold min-w-fit">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : 'Unknown time'}
                  </div>
                  <div className="text-gray-300 flex-1">
                    ✓ Order #{order._id?.slice(-6).toUpperCase()} for ৳
                    {(order.totalAmount || 0).toLocaleString()} by {order.user?.name || 'Unknown'}
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300">
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboardEnhanced
