import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getAuthHeaders } from '../../services/authService'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [conversations, setConversations] = useState([])
  const [conversationsLoading, setConversationsLoading] = useState(false)
  const [conversationsError, setConversationsError] = useState('')
  const [activeConversation, setActiveConversation] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [replyLoading, setReplyLoading] = useState(false)

  // Fetch users when users tab is active
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers()
    }
  }, [activeTab])

  // Fetch orders when orders tab is active
  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders()
    }
  }, [activeTab])

  // Fetch support conversations when messages tab is active
  useEffect(() => {
    if (activeTab === 'messages') {
      fetchConversations()
    }
  }, [activeTab])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/auth/users', {
        headers: getAuthHeaders()
      })
      if (response.ok) {
        const data = await response.json()
        const userList = data.users || data.data || []
        setUsers(userList)
      } else {
        console.error('Failed to fetch users:', response.status)
        setUsers([])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: getAuthHeaders()
      })
      if (response.ok) {
        const data = await response.json()
        const orderList = data.orders || data.data || []
        setOrders(orderList)
      } else {
        console.error('Failed to fetch orders:', response.status)
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const fetchConversations = async () => {
    try {
      setConversationsLoading(true)
      setConversationsError('')
      const response = await fetch('http://localhost:5000/api/support/messages', {
        headers: getAuthHeaders()
      })
      if (!response.ok) {
        throw new Error('Failed to fetch support messages')
      }
      const data = await response.json()
      setConversations(data.conversations || [])
      setActiveConversation((prev) => {
        if (!prev) return (data.conversations || [])[0] || null
        return (data.conversations || []).find((c) => c._id === prev._id) || (data.conversations || [])[0] || null
      })
    } catch (error) {
      console.error('Error fetching support conversations:', error)
      setConversationsError(error.message || 'Failed to fetch support messages')
      setConversations([])
      setActiveConversation(null)
    } finally {
      setConversationsLoading(false)
    }
  }

  const deleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return
    }

    setDeleting(userId)
    try {
      const response = await fetch(`http://localhost:5000/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (response.ok) {
        setUsers(users.filter(u => u._id !== userId && u.uid !== userId))
        alert('✓ User deleted successfully')
      } else {
        alert('✗ Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('✗ Error deleting user')
    } finally {
      setDeleting(null)
    }
  }

  const approveOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'confirmed' })
      })
      if (response.ok) {
        fetchOrders()
        alert('✓ Order approved successfully')
      } else {
        alert('✗ Failed to approve order')
      }
    } catch (error) {
      console.error('Error approving order:', error)
      alert('✗ Error approving order')
    }
  }

  const rejectOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'rejected' })
      })
      if (response.ok) {
        fetchOrders()
        alert('✓ Order rejected')
      } else {
        alert('✗ Failed to reject order')
      }
    } catch (error) {
      console.error('Error rejecting order:', error)
      alert('✗ Error rejecting order')
    }
  }

  const sendReply = async () => {
    if (!activeConversation || !replyText.trim()) return

    try {
      setReplyLoading(true)
      const response = await fetch(
        `http://localhost:5000/api/support/messages/${activeConversation._id}/reply`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ text: replyText.trim() })
        }
      )
      if (!response.ok) {
        throw new Error('Failed to send reply')
      }
      const data = await response.json()
      setReplyText('')
      // Refresh conversations list to keep everything in sync
      await fetchConversations()
      setActiveConversation(data.conversation)
    } catch (error) {
      console.error('Error sending reply:', error)
      alert(error.message || 'Failed to send reply')
    } finally {
      setReplyLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-950 text-white flex">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-950 border-r border-gray-800 sticky top-0 h-screen overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-black text-transparent bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text">👑 Admin</h1>
          <p className="text-xs text-gray-400 mt-1">Control Center</p>
        </div>

        {/* Admin Info */}
        <div className="p-4 m-4 bg-red-500/20 border border-red-500/30 rounded-xl">
          <p className="text-xs text-gray-400">Logged in as</p>
          <p className="font-bold text-red-400 mt-1">{user?.name}</p>
          <p className="text-xs text-gray-500 mt-2">{user?.email}</p>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition duration-300 text-left ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-blue-400'
            }`}
          >
            <span className="text-xl">👥</span>
            <span>All Users</span>
            <span className="ml-auto bg-blue-600/50 px-2 py-1 rounded text-xs font-bold">{users.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition duration-300 text-left ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-green-400'
            }`}
          >
            <span className="text-xl">📦</span>
            <span>Orders</span>
            <span className="ml-auto bg-green-600/50 px-2 py-1 rounded text-xs font-bold">
              {orders.filter(o => o.status === 'pending').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition duration-300 text-left ${
              activeTab === 'messages'
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-purple-400'
            }`}
          >
            <span className="text-xl">💬</span>
            <span>Messages</span>
          </button>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800 mt-auto sticky bottom-0 bg-gray-950/95">
          <button
            onClick={logout}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-6 py-3 rounded-lg font-bold transition duration-300 shadow-lg"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-2xl">
          <div className="px-8 py-6">
            <h2 className="text-3xl font-black text-white">
              {activeTab === 'users' && '👥 User Management'}
              {activeTab === 'orders' && '📦 Order Approvals'}
              {activeTab === 'messages' && '💬 Customer Support Messages'}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {activeTab === 'users' && 'View and manage all registered users'}
              {activeTab === 'orders' && 'Accept or reject customer orders'}
              {activeTab === 'messages' && 'View and reply to customer support messages'}
            </p>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div>
              {/* Statistics Card */}
              <div className="mb-8 bg-gradient-to-br from-blue-900/40 to-gray-900 p-8 rounded-3xl border border-blue-500/30 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="text-6xl">👥</div>
                  <div>
                    <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Users</p>
                    <p className="text-5xl font-black text-transparent bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text">
                      {users.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl border border-gray-700 overflow-hidden shadow-2xl">
                {/* Table Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6 border-b border-gray-700">
                  <h3 className="text-2xl font-bold text-white">All Users</h3>
                </div>

                {/* Table Content */}
                {loading ? (
                  <div className="p-12 text-center">
                    <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
                    <p className="text-gray-400 text-lg">Loading users from database...</p>
                  </div>
                ) : users.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-gray-400 text-xl mb-2">No users found in database</p>
                    <p className="text-gray-500">Users will appear here as they register</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-800/50 border-b border-gray-700">
                          <th className="px-8 py-4 text-left font-bold text-gray-300 uppercase text-sm tracking-wider">Name</th>
                          <th className="px-8 py-4 text-left font-bold text-gray-300 uppercase text-sm tracking-wider">Email</th>
                          <th className="px-8 py-4 text-left font-bold text-gray-300 uppercase text-sm tracking-wider">Role</th>
                          <th className="px-8 py-4 text-left font-bold text-gray-300 uppercase text-sm tracking-wider">Status</th>
                          <th className="px-8 py-4 text-left font-bold text-gray-300 uppercase text-sm tracking-wider">Joined</th>
                          <th className="px-8 py-4 text-center font-bold text-gray-300 uppercase text-sm tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u, index) => (
                          <tr
                            key={u._id || u.uid}
                            className={`border-b border-gray-800/50 transition duration-300 ${
                              index % 2 === 0 ? 'bg-gray-900/50' : 'bg-gray-950/50'
                            } hover:bg-gray-800/50`}
                          >
                            {/* Name */}
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold">
                                  {u.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-bold text-white">{u.name}</p>
                                </div>
                              </div>
                            </td>

                            {/* Email */}
                            <td className="px-8 py-6">
                              <p className="text-gray-300 text-sm break-all">{u.email}</p>
                            </td>

                            {/* Role */}
                            <td className="px-8 py-6">
                              <span
                                className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider inline-block ${
                                  u.role === 'admin'
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                }`}
                              >
                                {u.role === 'admin' ? '👑 Admin' : '🛍️ Customer'}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="px-8 py-6">
                              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 font-semibold text-xs">
                                ✓ Active
                              </span>
                            </td>

                            {/* Joined Date */}
                            <td className="px-8 py-6">
                              <p className="text-gray-400 text-sm">
                                {new Date(u.createdAt || u.firstLogin || Date.now()).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </td>

                            {/* Delete Button */}
                            <td className="px-8 py-6 text-center">
                              {u.role !== 'admin' ? (
                                <button
                                  onClick={() => deleteUser(u._id || u.uid, u.name)}
                                  disabled={deleting === (u._id || u.uid)}
                                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-bold text-sm transition duration-300 transform hover:scale-105 shadow-lg"
                                >
                                  {deleting === (u._id || u.uid) ? '⏳ Deleting...' : '🗑️ Delete'}
                                </button>
                              ) : (
                                <span className="text-gray-500 text-sm font-semibold">Can't delete admin</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Refresh Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={fetchUsers}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold transition duration-300 transform hover:scale-105 shadow-lg"
                >
                  {loading ? '⏳ Refreshing...' : '🔄 Refresh Users'}
                </button>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div>
              <div className="text-center py-20">
                <p className="text-gray-400 text-xl mb-4">📦 Orders section coming soon</p>
                <p className="text-gray-500">Backend endpoint needs to be configured</p>
              </div>
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Conversations list */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl border border-gray-700 p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-black text-white">Customer Conversations</h3>
                    <button
                      onClick={fetchConversations}
                      disabled={conversationsLoading}
                      className="text-xs px-3 py-1 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold"
                    >
                      {conversationsLoading ? 'Refreshing...' : 'Refresh'}
                    </button>
                  </div>
                  {conversationsError && (
                    <div className="mb-3 text-xs text-red-400">
                      {conversationsError}
                    </div>
                  )}
                  {conversationsLoading ? (
                    <p className="text-gray-400 text-sm">Loading conversations...</p>
                  ) : conversations.length === 0 ? (
                    <p className="text-gray-500 text-sm">No customer messages yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {conversations.map((conv) => {
                        const lastMessage = conv.messages[conv.messages.length - 1]
                        return (
                          <button
                            key={conv._id}
                            onClick={() => setActiveConversation(conv)}
                            className={`w-full text-left px-4 py-3 rounded-2xl border text-sm transition ${
                              activeConversation && activeConversation._id === conv._id
                                ? 'border-purple-500 bg-purple-500/10'
                                : 'border-gray-700 bg-gray-900/60 hover:border-purple-400/60 hover:bg-gray-800/70'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-white">
                                {conv.user?.name || 'Unknown Customer'}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {lastMessage?.createdAt
                                  ? new Date(lastMessage.createdAt).toLocaleString()
                                  : ''}
                              </span>
                            </div>
                            <p className="text-xs text-gray-300 line-clamp-2">
                              {lastMessage
                                ? `${lastMessage.from === 'customer' ? 'Customer' : 'Admin'}: ${lastMessage.text}`
                                : 'No messages yet'}
                            </p>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Conversation view & reply */}
                <div className="xl:col-span-2 bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl border border-gray-700 p-6 shadow-2xl flex flex-col h-[32rem]">
                  {activeConversation ? (
                    <>
                      <div className="mb-4">
                        <p className="text-xs text-gray-400 mb-1 uppercase font-semibold tracking-wider">
                          Customer
                        </p>
                        <p className="text-lg font-bold text-white">
                          {activeConversation.user?.name || 'Unknown Customer'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {activeConversation.user?.email || ''}
                        </p>
                      </div>
                      <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
                        {activeConversation.messages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`flex ${
                              msg.from === 'customer' ? 'justify-start' : 'justify-end'
                            }`}
                          >
                            <div
                              className={`max-w-md rounded-2xl px-4 py-2 text-sm ${
                                msg.from === 'customer'
                                  ? 'bg-gray-800 text-gray-100 rounded-tl-none'
                                  : 'bg-purple-600 text-white rounded-tr-none'
                              }`}
                            >
                              <p className="mb-1 text-[11px] font-semibold opacity-80">
                                {msg.from === 'customer' ? activeConversation.user?.name || 'Customer' : 'Admin'}
                              </p>
                              <p>{msg.text}</p>
                              {msg.createdAt && (
                                <p className="mt-1 text-[10px] opacity-70">
                                  {new Date(msg.createdAt).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-auto pt-4 border-t border-gray-700">
                        <label className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">
                          Reply as Admin
                        </label>
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your reply to this customer..."
                          className="w-full h-24 bg-gray-900/80 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 resize-none"
                        />
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={sendReply}
                            disabled={replyLoading || !replyText.trim()}
                            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl font-bold text-sm transition duration-300"
                          >
                            {replyLoading ? 'Sending...' : 'Send Reply'}
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                      Select a conversation from the left to view and reply.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
