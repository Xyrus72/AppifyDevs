import React, { useState, useEffect } from 'react'
import { BACKEND_URL } from '../../../services/authService'
import axios from 'axios'

const OrderApproval = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('pending')

  useEffect(() => {
    fetchOrders()
  }, [filter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const endpoint = filter === 'pending' ? '/api/admin/orders/pending' : '/api/admin/orders/all'
      const response = await axios.get(`${BACKEND_URL}${endpoint}`)
      setOrders(response.data.data || [])
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveOrder = async (orderId) => {
    try {
      const response = await axios.put(`${BACKEND_URL}/api/admin/order/${orderId}/approve`)
      setOrders(orders.map(o => o._id === orderId ? response.data.data : o))
      alert('Order approved!')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve order')
    }
  }

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? Customer will get a refund.')) return

    try {
      const response = await axios.put(`${BACKEND_URL}/api/admin/order/${orderId}/cancel`)
      setOrders(orders.map(o => o._id === orderId ? response.data.data : o))
      alert('Order cancelled and refund processed!')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order')
    }
  }

  const filteredOrders = filter === 'pending' 
    ? orders.filter(o => o.status === 'pending')
    : orders

  return (
    <div className="w-full">
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">📬 Order Approval</h1>
          <p className="text-gray-400">Approve or cancel customer orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter('pending')}
            className={`px-6 py-2 rounded-lg font-bold transition ${
              filter === 'pending'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            ⏳ Pending {orders.filter(o => o.status === 'pending').length}
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-bold transition ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            📋 All Orders {orders.length}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-400">Loading orders...</p>
          </div>
        )}

        {/* Orders List */}
        {!loading && (
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No orders found</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order._id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Order Info */}
                    <div>
                      <div className="mb-4">
                        <p className="text-gray-400 text-sm">Order ID</p>
                        <p className="text-white font-mono text-sm">{order._id.slice(0, 12)}...</p>
                      </div>
                      <div className="mb-4">
                        <p className="text-gray-400 text-sm">Customer</p>
                        <p className="text-white font-semibold">{order.user?.name}</p>
                        <p className="text-gray-400 text-sm">{order.user?.email}</p>
                      </div>
                      <div className="mb-4">
                        <p className="text-gray-400 text-sm">Total Amount</p>
                        <p className="text-white text-2xl font-bold">৳{order.totalAmount}</p>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div>
                      <div className="mb-4">
                        <p className="text-gray-400 text-sm">Order Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                          order.status === 'pending'
                            ? 'bg-yellow-600/30 text-yellow-400 border border-yellow-500/50'
                            : 'bg-green-600/30 text-green-400 border border-green-500/50'
                        }`}>
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="mb-4">
                        <p className="text-gray-400 text-sm">Payment Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                          order.paymentStatus === 'paid'
                            ? 'bg-green-600/30 text-green-400 border border-green-500/50'
                            : 'bg-yellow-600/30 text-yellow-400 border border-yellow-500/50'
                        }`}>
                          {order.paymentStatus.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Order Date</p>
                        <p className="text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <p className="text-gray-400 text-sm font-semibold mb-3">Items ({order.items.length})</p>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-300">{item.productName} x{item.quantity}</span>
                          <span className="text-white font-semibold">৳{item.subtotal}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  {order.status === 'pending' && (
                    <div className="mt-6 pt-6 border-t border-gray-700 flex gap-3">
                      <button
                        onClick={() => handleApproveOrder(order._id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
                      >
                        ✅ Approve Order
                      </button>
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
                      >
                        ❌ Cancel & Refund
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderApproval
