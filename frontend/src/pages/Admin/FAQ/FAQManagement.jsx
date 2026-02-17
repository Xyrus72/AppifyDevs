import React, { useState } from 'react'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'

/**
 * FAQ Management Page
 * Features: Create, Edit, Delete, and View frequently asked questions
 * CRUD functionality for FAQ content
 */
const FAQManagement = () => {
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: 'What is the return policy?',
      category: 'Returns',
      status: 'Active',
      views: 2450
    },
    {
      id: 2,
      question: 'How long does shipping take?',
      category: 'Shipping',
      status: 'Active',
      views: 1880
    }
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFAQ, setEditingFAQ] = useState(null)
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    status: 'Active'
  })

  const handleAddFAQ = () => {
    setEditingFAQ(null)
    setFormData({ question: '', answer: '', category: '', status: 'Active' })
    setIsModalOpen(true)
  }

  const handleEditFAQ = (faq) => {
    setEditingFAQ(faq)
    setFormData({
      question: faq.question,
      answer: '',
      category: faq.category,
      status: faq.status
    })
    setIsModalOpen(true)
  }

  const handleDeleteFAQ = (faq) => {
    if (window.confirm(`Delete FAQ "${faq.question}"?`)) {
      setFaqs(faqs.filter(f => f.id !== faq.id))
      alert('✓ FAQ deleted successfully')
    }
  }

  const handleSaveFAQ = () => {
    if (!formData.question || !formData.answer || !formData.category) {
      alert('❌ Please fill in all required fields')
      return
    }

    if (editingFAQ) {
      setFaqs(faqs.map(f => 
        f.id === editingFAQ.id 
          ? { ...f, ...formData }
          : f
      ))
      alert('✓ FAQ updated successfully')
    } else {
      setFaqs([...faqs, {
        id: Math.max(...faqs.map(f => f.id), 0) + 1,
        ...formData,
        views: 0
      }])
      alert('✓ FAQ added successfully')
    }
    setIsModalOpen(false)
  }

  const columns = [
    { key: 'question', label: 'Question' },
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
      key: 'views', 
      label: 'Views',
      render: (item) => `👁️ ${item.views.toLocaleString()}`
    }
  ]

  return (
    <div className="w-full min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-2xl">
        <div className="px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-white">❓ FAQ Management</h1>
            <p className="text-gray-400 text-sm mt-2">Manage frequently asked questions</p>
          </div>
          <button
            onClick={handleAddFAQ}
            className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white px-8 py-3 rounded-xl font-bold transition duration-300 shadow-lg"
          >
            + Add FAQ
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="p-8 max-w-7xl mx-auto">
        <DataTable
          columns={columns}
          data={faqs}
          onEdit={handleEditFAQ}
          onDelete={handleDeleteFAQ}
          emptyMessage="No FAQs found. Click 'Add FAQ' to create one."
        />
      </main>

      {/* FAQ Form Modal */}
      <Modal
        isOpen={isModalOpen}
        title={editingFAQ ? '✏️ Edit FAQ' : '❓ Add New FAQ'}
        onClose={() => setIsModalOpen(false)}
        size="lg"
      >
        <div className="space-y-6">
          {/* Question */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Question *</label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="Enter the question"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition duration-300"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 transition duration-300"
            >
              <option value="">Select Category</option>
              <option value="Shipping">Shipping</option>
              <option value="Returns">Returns</option>
              <option value="Payment">Payment</option>
              <option value="Account">Account</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Answer */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Answer *</label>
            <textarea
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              placeholder="Enter the answer"
              rows="6"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition duration-300 resize-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 transition duration-300"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSaveFAQ}
              className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white px-8 py-3 rounded-lg font-bold transition duration-300"
            >
              ✓ {editingFAQ ? 'Update' : 'Create'} FAQ
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

export default FAQManagement
