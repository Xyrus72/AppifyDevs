import React, { useState } from 'react'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'

/**
 * Website Policies Management Page
 * Features: Manage website policies like Privacy Policy, Terms of Service, etc.
 * CRUD functionality for policy pages
 */
const PolicyManagement = () => {
  const [policies, setPolicies] = useState([
    {
      id: 1,
      title: 'Privacy Policy',
      category: 'Legal',
      status: 'Active',
      lastUpdated: '2024-02-01'
    },
    {
      id: 2,
      title: 'Terms of Service',
      category: 'Legal',
      status: 'Active',
      lastUpdated: '2024-01-15'
    },
    {
      id: 3,
      title: 'Return Policy',
      category: 'Customer Service',
      status: 'Active',
      lastUpdated: '2024-02-10'
    }
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    status: 'Active'
  })

  const handleAddPolicy = () => {
    setEditingPolicy(null)
    setFormData({ title: '', category: '', content: '', status: 'Active' })
    setIsModalOpen(true)
  }

  const handleEditPolicy = (policy) => {
    setEditingPolicy(policy)
    setFormData({
      title: policy.title,
      category: policy.category,
      content: '',
      status: policy.status
    })
    setIsModalOpen(true)
  }

  const handleDeletePolicy = (policy) => {
    if (window.confirm(`Delete policy "${policy.title}"?`)) {
      setPolicies(policies.filter(p => p.id !== policy.id))
      alert('✓ Policy deleted successfully')
    }
  }

  const handleSavePolicy = () => {
    if (!formData.title || !formData.category || !formData.content) {
      alert('❌ Please fill in all required fields')
      return
    }

    if (editingPolicy) {
      setPolicies(policies.map(p => 
        p.id === editingPolicy.id 
          ? { ...p, ...formData, lastUpdated: new Date().toISOString().split('T')[0] }
          : p
      ))
      alert('✓ Policy updated successfully')
    } else {
      setPolicies([...policies, {
        id: Math.max(...policies.map(p => p.id), 0) + 1,
        ...formData,
        lastUpdated: new Date().toISOString().split('T')[0]
      }])
      alert('✓ Policy created successfully')
    }
    setIsModalOpen(false)
  }

  const columns = [
    { key: 'title', label: 'Policy Title' },
    { key: 'category', label: 'Category' },
    { 
      key: 'status', 
      label: 'Status',
      render: (item) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          item.status === 'Active'
            ? 'bg-green-500/20 text-green-400'
            : 'bg-gray-500/20 text-gray-400'
        }`}>
          {item.status}
        </span>
      )
    },
    { 
      key: 'lastUpdated', 
      label: 'Last Updated',
      render: (item) => new Date(item.lastUpdated).toLocaleDateString()
    }
  ]

  return (
    <div className="w-full min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-2xl">
        <div className="px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-white">📋 Policy Management</h1>
            <p className="text-gray-400 text-sm mt-2">Manage website policies and terms</p>
          </div>
          <button
            onClick={handleAddPolicy}
            className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-8 py-3 rounded-xl font-bold transition duration-300 shadow-lg"
          >
            + Add Policy
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="p-8 max-w-7xl mx-auto">
        <DataTable
          columns={columns}
          data={policies}
          onEdit={handleEditPolicy}
          onDelete={handleDeletePolicy}
          emptyMessage="No policies found. Click 'Add Policy' to create one."
        />
      </main>

      {/* Policy Form Modal */}
      <Modal
        isOpen={isModalOpen}
        title={editingPolicy ? '✏️ Edit Policy' : '📋 Add New Policy'}
        onClose={() => setIsModalOpen(false)}
        size="xl"
      >
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Policy Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter policy title"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition duration-300"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 transition duration-300"
            >
              <option value="">Select Category</option>
              <option value="Legal">Legal</option>
              <option value="Customer Service">Customer Service</option>
              <option value="Shipping">Shipping</option>
              <option value="Payment">Payment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Policy Content *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter policy content"
              rows="8"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition duration-300 resize-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 transition duration-300"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSavePolicy}
              className="flex-1 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-8 py-3 rounded-lg font-bold transition duration-300"
            >
              ✓ {editingPolicy ? 'Update' : 'Create'} Policy
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-bold transition duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PolicyManagement
