import React, { useEffect, useState } from 'react'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { getAuthHeaders } from '../../../services/authService'

/**
 * Order Management Page
 * Features: View, Approve, Reject, and Manage orders
 * Track order status and customer information
 */
const OrderManagement = () => {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch(`${baseUrl}/api/orders?all=true`, {
        headers: getAuthHeaders()
      })
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      const data = await response.json()
      const orderList = data.orders || data.data || []
      setOrders(orderList)
    } catch (err) {
      console.error('Error loading orders:', err)
      setError(err.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleApproveOrder = async (order) => {
    if (!window.confirm(`Approve order ${order._id}?`)) return

    try {
      const response = await fetch(`${baseUrl}/api/orders/${order._id}/status`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'confirmed' })
      })

      if (!response.ok) {
        throw new Error('Failed to approve order')
      }

      await loadOrders()
      alert('✓ Order approved successfully')
    } catch (err) {
      console.error('Error approving order:', err)
      alert(err.message || 'Failed to approve order')
    }
  }

  const handleRejectOrder = async (order) => {
    if (!window.confirm(`Reject order ${order._id}?`)) return

    try {
      const response = await fetch(`${baseUrl}/api/orders/${order._id}/status`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'cancelled' })
      })

      if (!response.ok) {
        throw new Error('Failed to reject order')
      }

      await loadOrders()
      alert('✓ Order rejected')
    } catch (err) {
      console.error('Error rejecting order:', err)
      alert(err.message || 'Failed to reject order')
    }
  }

  const handleViewDetails = (order) => {
    setSelectedOrder(order)
    setIsDetailModalOpen(true)
  }

  const columns = [
    { key: '_id', label: 'Order ID' },
    { 
      key: 'customer', 
      label: 'Customer',
      render: (item) => item.user?.name || 'Unknown'
    },
    { 
      key: 'email', 
      label: 'Email',
      render: (item) => item.user?.email || 'Unknown'
    },
    { 
      key: 'totalAmount', 
      label: 'Amount',
      render: (item) => `৳${(item.totalAmount || 0).toLocaleString()}`
    },
    { 
      key: 'items', 
      label: 'Items',
      render: (item) => `${(item.items || []).length} items`
    },
    { 
      key: 'createdAt', 
      label: 'Date',
      render: (item) => item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (item) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          item.status === 'confirmed'
            ? 'bg-green-500/20 text-green-400'
            : item.status === 'pending'
            ? 'bg-yellow-500/20 text-yellow-400'
            : 'bg-red-500/20 text-red-400'
        }`}>
          {item.status}
        </span>
      )
    }
  ]

  return (
    <div className="w-full min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-2xl">
        <div className="px-8 py-6">
          <h1 className="text-4xl font-black text-white">📬 Order Management</h1>
          <p className="text-gray-400 text-sm mt-2">Manage and approve customer orders</p>
        </div>
      </header>

      {/* Content */}
      <main className="p-8 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-900/40 to-gray-900 p-6 rounded-2xl border border-yellow-500/30">
            <p className="text-gray-400 text-sm font-semibold uppercase">Pending Orders</p>
            <p className="text-4xl font-black text-yellow-400 mt-2">
              {orders.filter(o => o.status === 'pending').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-900/40 to-gray-900 p-6 rounded-2xl border border-green-500/30">
            <p className="text-gray-400 text-sm font-semibold uppercase">Approved Orders</p>
            <p className="text-4xl font-black text-green-400 mt-2">
              {orders.filter(o => o.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-900/40 to-gray-900 p-6 rounded-2xl border border-blue-500/30">
            <p className="text-gray-400 text-sm font-semibold uppercase">Total Revenue</p>
            <p className="text-4xl font-black text-blue-400 mt-2">
              ৳{orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Orders Table with Custom Actions */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-700 overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-xl font-black text-white">All Orders</h3>
            <button
              onClick={loadOrders}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition duration-300"
            >
              {loading ? 'Refreshing...' : '🔄 Refresh'}
            </button>
          </div>

          {error && (
            <div className="p-4 text-red-300 text-sm border-b border-red-500/40 bg-red-500/10">
              {error}
            </div>
          )}

          {orders.length === 0 && !loading ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 text-lg">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800/50 border-b border-gray-700">
                    {columns.map((col, idx) => (
                      <th
                        key={idx}
                        className="px-8 py-4 text-left font-bold text-gray-300 uppercase text-xs tracking-wider"
                      >
                        {col.label}
                      </th>
                    ))}
                    <th className="px-8 py-4 text-center font-bold text-gray-300 uppercase text-xs tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => (
                    <tr
                      key={order._id}
                      className={`border-b border-gray-800/50 transition duration-300 ${
                        idx % 2 === 0 ? 'bg-gray-900/50' : 'bg-gray-950/50'
                      } hover:bg-gray-800/30`}
                    >
                      {columns.map((col, colIdx) => (
                        <td key={colIdx} className="px-8 py-6">
                          {col.render ? col.render(order) : (
                            <span className="text-gray-300">
                              {order[col.key] || 'N/A'}
                            </span>
                          )}
                        </td>
                      ))}
                      <td className="px-8 py-6 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition duration-300"
                          >
                            👁️ View
                          </button>
                          {order.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveOrder(order)}
                                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition duration-300"
                              >
                                ✓ Approve
                              </button>
                              <button
                                onClick={() => handleRejectOrder(order)}
                                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition duration-300"
                              >
                                ✗ Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Order Details Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        title="📦 Order Details"
        onClose={() => setIsDetailModalOpen(false)}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Order ID</p>
                <p className="text-white font-bold text-lg mt-1">{selectedOrder._id}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Date</p>
                <p className="text-white font-bold text-lg mt-1">
                  {selectedOrder.createdAt
                    ? new Date(selectedOrder.createdAt).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>

            <div className="bg-gray-800/30 p-4 rounded-lg">
              <p className="text-gray-400 text-xs uppercase mb-3">Customer Information</p>
              <p className="text-white font-bold">{selectedOrder.user?.name || 'Unknown'}</p>
              <p className="text-gray-300 text-sm">{selectedOrder.user?.email || 'Unknown'}</p>
            </div>

            <div className="bg-gray-800/30 p-4 rounded-lg">
              <p className="text-gray-400 text-xs uppercase mb-3">Order Summary</p>
              <div className="flex justify-between mb-3">
                <span className="text-gray-300">
                  Items: {(selectedOrder.items || []).length}
                </span>
                <span className="text-white font-bold">
                  ৳{(selectedOrder.totalAmount || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Status:</span>
                <span
                  className={`font-bold ${
                    selectedOrder.status === 'confirmed' ? 'text-green-400' : 'text-yellow-400'
                  }`}
                >
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-bold transition duration-300"
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

export default OrderManagement
