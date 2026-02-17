import React, { useState, useEffect, useRef } from 'react'
import { BACKEND_URL } from '../../services/authService'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

const CustomerSupport = () => {
  const { user } = useAuth()
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (user) {
      initializeConversation()
    }
  }, [user])

  useEffect(() => {
    if (conversation) {
      fetchMessages()
      const interval = setInterval(fetchMessages, 2000)
      return () => clearInterval(interval)
    }
  }, [conversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const initializeConversation = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${BACKEND_URL}/api/messages/customer/${user._id}`)
      setConversation(response.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load conversation')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    if (!conversation) return

    try {
      const response = await axios.get(`${BACKEND_URL}/api/messages/conversation/${conversation._id}`)
      setMessages(response.data.data || [])
    } catch (err) {
      console.error('Fetch messages error:', err)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversation) return

    try {
      const response = await axios.post(`${BACKEND_URL}/api/messages/send`, {
        conversationId: conversation._id,
        senderId: user._id,
        senderRole: 'customer',
        senderName: user.name || 'Customer',
        senderEmail: user.email,
        message: newMessage
      })

      setMessages([...messages, response.data.data])
      setNewMessage('')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send message')
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden h-[600px] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-blue-600/20 to-cyan-600/20">
          <h1 className="text-2xl font-black text-white">💬 Support Chat</h1>
          <p className="text-gray-400 text-sm mt-1">Get help from our admin team</p>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400">Loading conversation...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-red-500/20 border border-red-500 text-red-200 p-6 rounded-lg text-center">
              <p>{error}</p>
            </div>
          </div>
        ) : conversation ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <p className="text-lg">Start a conversation with our support team</p>
                  <p className="text-sm mt-2">We usually respond within a few minutes</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.senderRole === 'customer' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.senderRole === 'customer'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-100 border border-gray-700'
                      }`}
                    >
                      <p className="text-sm font-semibold text-xs opacity-75 mb-1">
                        {msg.senderRole === 'customer' ? 'You' : 'Admin'}
                      </p>
                      <p>{msg.message}</p>
                      <p className={`text-xs mt-1 ${msg.senderRole === 'customer' ? 'text-blue-100' : 'text-gray-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-gray-700">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
                >
                  ➤ Send
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default CustomerSupport
