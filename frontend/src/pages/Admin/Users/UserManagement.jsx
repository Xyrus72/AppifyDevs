import React, { useState, useEffect } from 'react'
import { BACKEND_URL } from '../../../services/authService'
import axios from 'axios'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchEmail, setSearchEmail] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${BACKEND_URL}/api/admin/users`)
      setUsers(response.data.data || [])
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleBlockUser = async (userId, currentStatus) => {
    try {
      const response = await axios.put(`${BACKEND_URL}/api/admin/user/${userId}/block`, {
        isActive: !currentStatus
      })
      setUsers(users.map(u => u._id === userId ? response.data.data : u))
      alert(response.data.message)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to block user')
    }
  }

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) return

    try {
      const response = await axios.delete(`${BACKEND_URL}/api/admin/user/${userId}`)
      setUsers(users.filter(u => u._id !== userId))
      alert(response.data.message)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user')
    }
  }

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(searchEmail.toLowerCase()) ||
    u.name.toLowerCase().includes(searchEmail.toLowerCase())
  )

  return (
    <div className="w-full">
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">👥 User Management</h1>
          <p className="text-gray-400">View, block, and delete users</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
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
            <p className="text-gray-400">Loading users...</p>
          </div>
        )}

        {/* Table */}
        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Name</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Email</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Role</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Status</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Last Login</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="border-b border-gray-800 hover:bg-gray-800/30 transition">
                      <td className="py-4 px-4 text-white font-semibold">{user.name}</td>
                      <td className="py-4 px-4 text-gray-300 text-sm">{user.email}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.role === 'admin' 
                            ? 'bg-red-600/30 text-red-400 border border-red-500/50' 
                            : 'bg-blue-600/30 text-blue-400 border border-blue-500/50'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.isActive
                            ? 'bg-green-600/30 text-green-400 border border-green-500/50'
                            : 'bg-red-600/30 text-red-400 border border-red-500/50'
                        }`}>
                          {user.isActive ? '✅ Active' : '🚫 Blocked'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-400 text-sm">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 space-x-2">
                        <button
                          onClick={() => handleBlockUser(user._id, user.isActive)}
                          className={`px-3 py-1 rounded text-xs font-bold transition ${
                            user.isActive
                              ? 'bg-red-600/30 text-red-400 hover:bg-red-600/50'
                              : 'bg-green-600/30 text-green-400 hover:bg-green-600/50'
                          }`}
                        >
                          {user.isActive ? '🔒 Block' : '🔓 Unblock'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          className="px-3 py-1 bg-gray-700/50 text-gray-300 hover:bg-gray-700 rounded text-xs font-bold transition"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 pt-6 border-t border-gray-700 grid grid-cols-3 gap-4">
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-400 text-sm font-semibold">Total Users</p>
            <p className="text-2xl font-bold text-white mt-2">{filteredUsers.length}</p>
          </div>
          <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-400 text-sm font-semibold">Active Users</p>
            <p className="text-2xl font-bold text-white mt-2">{filteredUsers.filter(u => u.isActive).length}</p>
          </div>
          <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400 text-sm font-semibold">Blocked Users</p>
            <p className="text-2xl font-bold text-white mt-2">{filteredUsers.filter(u => !u.isActive).length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserManagement
