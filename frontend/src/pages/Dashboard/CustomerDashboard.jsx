import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { getAuthHeaders } from '../../services/authService'
import OrderTimeline from '../../components/OrderTimeline'

const CustomerDashboard = () => {
  const { user, balance } = useAuth()
  const location = useLocation()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    activeOrders: 0
  })
  const [chatConversation, setChatConversation] = useState(null)
  const [chatLoading, setChatLoading] = useState(false)
  const [chatError, setChatError] = useState('')
  const [chatText, setChatText] = useState('')

  useEffect(() => {
    fetchOrders()
    fetchChat()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: getAuthHeaders()
      })

      if (response.ok) {
        const data = await response.json()
        const userOrders = data.orders || data.data || []
        setOrders(userOrders)

        // Calculate stats
        const totalOrders = userOrders.length
        const totalSpent = userOrders.reduce((sum, order) => sum + order.totalAmount, 0)
        const activeOrders = userOrders.filter(order => 
          order.status !== 'delivered' && order.status !== 'cancelled'
        ).length

        setStats({
          totalOrders,
          totalSpent: totalSpent.toFixed(2),
          activeOrders
        })
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchChat = async () => {
    try {
      setChatLoading(true)
      setChatError('')
      const response = await fetch('http://localhost:5000/api/support/messages/my', {
        headers: getAuthHeaders()
      })
      if (response.ok) {
        const data = await response.json()
        setChatConversation(data.conversation)
      } else {
        setChatConversation(null)
      }
    } catch (error) {
      console.error('Error fetching support messages:', error)
      setChatError('Failed to load messages.')
    } finally {
      setChatLoading(false)
    }
  }

  const sendChatMessage = async () => {
    if (!chatText.trim()) return
    try {
      setChatError('')
      const response = await fetch('http://localhost:5000/api/support/messages', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ text: chatText.trim() })
      })
      if (!response.ok) {
        throw new Error('Failed to send message.')
      }
      const data = await response.json()
      setChatConversation(data.conversation)
      setChatText('')
    } catch (error) {
      console.error('Error sending support message:', error)
      setChatError(error.message || 'Failed to send message.')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'yellow',
      'confirmed': 'blue',
      'shipped': 'purple',
      'delivered': 'green',
      'cancelled': 'red'
    }
    return colors[status] || 'gray'
  }

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
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '📦', label: 'Total Orders', value: stats.totalOrders, color: 'from-blue-500 to-cyan-500' },
              { icon: '💰', label: 'Total Spent', value: `৳${stats.totalSpent}`, color: 'from-green-500 to-emerald-500' },
              { icon: '🚚', label: 'Active Orders', value: stats.activeOrders, color: 'from-purple-500 to-pink-500' },
              { icon: '💳', label: 'Wallet Balance', value: `৳${balance.toLocaleString()}`, color: 'from-yellow-500 to-orange-500' }
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

      {/* Recent Orders */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black mb-8 text-white">Recent Orders</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg mb-4">No orders yet</p>
                <Link to="/products" className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold transition">
                  Start Shopping →
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className={`group bg-gradient-to-r from-blue-500/10 to-blue-600/5 border-l-4 border-blue-500 p-6 rounded-lg hover:shadow-2xl transition backdrop-blur-sm hover:bg-opacity-20 cursor-pointer hover:border-cyan-400`}
                >
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-bold text-white">Order <span className="text-blue-400">#{order._id.slice(-6).toUpperCase()}</span></p>
                      <p className="text-gray-300 font-medium mt-1">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''} - ৳{order.totalAmount.toLocaleString()}
                      </p>
                      <div className="mt-3 space-y-1 text-sm">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <p key={idx} className="text-gray-400">• {item.productName} x{item.quantity}</p>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-gray-500 text-sm">+ {order.items.length - 2} more item(s)</p>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm mt-3">📅 {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-bold whitespace-nowrap`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      {order.paymentStatus === 'paid' && (
                        <span className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg font-bold whitespace-nowrap text-center text-sm">
                          ✓ Paid
                        </span>
                      )}
                      <span className="text-cyan-400 text-sm font-bold text-center">👁️ Click to track</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-gray-700 rounded-2xl max-h-[90vh] overflow-y-auto max-w-4xl w-full">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-black border-b border-gray-700 p-6 flex justify-between items-center">
              <h2 className="text-3xl font-black text-cyan-400">Order #{selectedOrder._id.slice(-6).toUpperCase()}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-3xl text-gray-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-8">
              {/* Timeline */}
              <OrderTimeline order={selectedOrder} />

              {/* Order Details */}
              <div className="bg-gradient-to-br from-gray-900/80 to-black border border-gray-800 rounded-2xl p-8">
                <h3 className="text-2xl font-black mb-6 text-cyan-400">📋 Order Details</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-gray-800/40 rounded-lg border border-gray-700">
                      <div>
                        <p className="font-bold text-white">{item.productName}</p>
                        <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                      </div>
                      <span className="text-xl font-bold text-cyan-400">৳{item.subtotal?.toLocaleString() || (item.priceAtOrder * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span className="text-white">Total Amount:</span>
                      <span className="text-green-400">৳{selectedOrder.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-gradient-to-br from-gray-900/80 to-black border border-gray-800 rounded-2xl p-8">
                <h3 className="text-2xl font-black mb-6 text-cyan-400">🏠 Delivery Address</h3>
                <div className="space-y-2 text-gray-300">
                  <p className="font-bold text-white">{selectedOrder.shippingAddress.fullName}</p>
                  <p>{selectedOrder.shippingAddress.address}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                  <p>📞 {selectedOrder.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gradient-to-br from-gray-900/80 to-black border border-gray-800 rounded-2xl p-8">
                <h3 className="text-2xl font-black mb-6 text-cyan-400">💳 Payment Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Payment Method:</span>
                    <span className="font-bold text-blue-400">{selectedOrder.paymentMethod === 'wallet' ? '💰 Wallet' : '💳 Card'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Payment Status:</span>
                    <span className={`font-bold ${selectedOrder.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gradient-to-r from-gray-900 to-black border-t border-gray-700 p-6">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-3 rounded-lg font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Footer Spacing */}
      <div className="h-20"></div>

      {/* Support Chat */}
      <section className="py-16 px-8 border-t border-gray-800 bg-black/60">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black mb-4 text-white">Support Chat</h2>
          <p className="text-gray-400 mb-6 text-sm">
            Chat directly with <span className="font-semibold text-cyan-400">Admin</span> about your orders or account.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 h-96 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {chatLoading ? (
                  <p className="text-gray-400 text-sm">Loading messages...</p>
                ) : !chatConversation || chatConversation.messages.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No messages yet. Start a conversation with Admin using the box on the right.
                  </p>
                ) : (
                  chatConversation.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.from === 'customer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs rounded-2xl px-4 py-2 text-sm ${
                          msg.from === 'customer'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-gray-800 text-gray-100 rounded-bl-none'
                        }`}
                      >
                        <p className="mb-1 text-xs font-semibold">
                          {msg.from === 'customer' ? 'You' : 'Admin'}
                        </p>
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {chatError && (
                <div className="mt-3 text-xs text-red-400">
                  {chatError}
                </div>
              )}
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 flex flex-col">
              <label className="block text-sm font-bold text-gray-300 mb-3">
                Send a message to Admin
              </label>
              <textarea
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 resize-none"
              />
              <button
                onClick={sendChatMessage}
                disabled={!chatText.trim()}
                className="mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-sm transition duration-300"
              >
                Send to Admin
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CustomerDashboard
