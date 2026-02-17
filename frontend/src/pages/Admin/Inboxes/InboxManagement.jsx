import React, { useState } from 'react'
import Modal from '../components/Modal'

/**
 * Inboxes Management Page
 * Features: View and manage contact inquiries from customers
 * Display customer messages and respond to inquiries
 */
const InboxManagement = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+880 1234567890',
      subject: 'Product Inquiry',
      message: 'I am interested in your summer collection. Can you provide more details?',
      date: '2024-02-15',
      status: 'Unread'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+880 9876543210',
      subject: 'Return Request',
      message: 'I want to return a product I received yesterday. It does not fit.',
      date: '2024-02-14',
      status: 'Read'
    },
    {
      id: 3,
      name: 'Alex Johnson',
      email: 'alex@example.com',
      phone: '+880 5555555555',
      subject: 'Shipping Issue',
      message: 'My order has not arrived yet. Can you check the tracking?',
      date: '2024-02-10',
      status: 'Read'
    }
  ])

  const [selectedMessage, setSelectedMessage] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  const handleViewMessage = (message) => {
    setSelectedMessage({ ...message, status: 'Read' })
    setMessages(messages.map(m => m.id === message.id ? { ...m, status: 'Read' } : m))
    setIsDetailModalOpen(true)
    setReplyText('')
  }

  const handleSendReply = () => {
    if (!replyText.trim()) {
      alert('❌ Please enter a reply message')
      return
    }
    alert('✓ Reply sent successfully to ' + selectedMessage.email)
    setReplyText('')
    setIsDetailModalOpen(false)
  }

  const handleDeleteMessage = (id) => {
    if (window.confirm('Delete this message?')) {
      setMessages(messages.filter(m => m.id !== id))
      alert('✓ Message deleted')
    }
  }

  const filteredMessages = filterStatus === 'All' 
    ? messages 
    : messages.filter(m => m.status === filterStatus)

  const unreadCount = messages.filter(m => m.status === 'Unread').length

  return (
    <div className="w-full min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-2xl">
        <div className="px-8 py-6">
          <h1 className="text-4xl font-black text-white">📧 Inbox Management</h1>
          <p className="text-gray-400 text-sm mt-2">View and manage customer inquiries</p>
        </div>
      </header>

      {/* Content */}
      <main className="p-8 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-red-900/40 to-gray-900 p-6 rounded-2xl border border-red-500/30">
            <p className="text-gray-400 text-sm font-semibold uppercase">Unread Messages</p>
            <p className="text-4xl font-black text-red-400 mt-2">{unreadCount}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-900/40 to-gray-900 p-6 rounded-2xl border border-blue-500/30">
            <p className="text-gray-400 text-sm font-semibold uppercase">Total Messages</p>
            <p className="text-4xl font-black text-blue-400 mt-2">{messages.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-900/40 to-gray-900 p-6 rounded-2xl border border-green-500/30">
            <p className="text-gray-400 text-sm font-semibold uppercase">Read Messages</p>
            <p className="text-4xl font-black text-green-400 mt-2">
              {messages.filter(m => m.status === 'Read').length}
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-8 flex gap-4">
          {['All', 'Unread', 'Read'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-6 py-2 rounded-lg font-bold uppercase text-xs transition duration-300 ${
                filterStatus === status
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No messages found</p>
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-6 rounded-2xl cursor-pointer transition duration-300 border ${
                  msg.status === 'Unread'
                    ? 'bg-gradient-to-br from-blue-900/30 to-gray-900 border-blue-500/40 hover:border-blue-500/60'
                    : 'bg-gradient-to-br from-gray-900 to-gray-950 border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => handleViewMessage(msg)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-black text-white">{msg.name}</h3>
                      {msg.status === 'Unread' && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">NEW</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{msg.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">{new Date(msg.date).toLocaleDateString()}</p>
                    <p className="text-gray-400 text-xs mt-1">{msg.phone}</p>
                  </div>
                </div>

                <p className="text-gray-300 font-bold mb-2">Subject: {msg.subject}</p>
                <p className="text-gray-400 line-clamp-2">{msg.message}</p>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewMessage(msg)
                    }}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition duration-300"
                  >
                    👁️ View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteMessage(msg.id)
                    }}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition duration-300"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Message Details Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        title="📧 Message Details"
        onClose={() => setIsDetailModalOpen(false)}
        size="lg"
      >
        {selectedMessage && (
          <div className="space-y-6">
            {/* Sender Info */}
            <div className="bg-gray-800/30 p-4 rounded-lg">
              <p className="text-gray-400 text-xs uppercase mb-3">From:</p>
              <p className="text-white font-bold">{selectedMessage.name}</p>
              <p className="text-gray-300 text-sm">{selectedMessage.email}</p>
              <p className="text-gray-300 text-sm">{selectedMessage.phone}</p>
              <p className="text-gray-400 text-xs mt-3">{new Date(selectedMessage.date).toLocaleString()}</p>
            </div>

            {/* Subject */}
            <div>
              <p className="text-gray-400 text-xs uppercase mb-2">Subject</p>
              <p className="text-white font-bold text-lg">{selectedMessage.subject}</p>
            </div>

            {/* Message Content */}
            <div>
              <p className="text-gray-400 text-xs uppercase mb-2">Message</p>
              <div className="bg-gray-800/30 p-4 rounded-lg">
                <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>

            {/* Reply Box */}
            <div>
              <p className="text-gray-400 text-xs uppercase mb-2">Your Reply</p>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply message..."
                rows="5"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition duration-300 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSendReply}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-3 rounded-lg font-bold transition duration-300"
              >
                ✉️ Send Reply
              </button>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-bold transition duration-300"
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

export default InboxManagement
