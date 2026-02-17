import React, { useState, useEffect, useRef } from 'react'
import { BACKEND_URL } from '../../../services/authService'
import axios from 'axios'
import { useAuth } from '../../../context/AuthContext'

const AdminChat = () => {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchConversations()
    const interval = setInterval(fetchConversations, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages()
      const interval = setInterval(fetchMessages, 2000)
      return () => clearInterval(interval)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/messages/admin/conversations`)
      setConversations(response.data.data || [])
    } catch (err) {
      console.error('Fetch conversations error:', err)
    }
  }

  const fetchMessages = async () => {
    if (!selectedConversation) return

    try {
      const response = await axios.get(`${BACKEND_URL}/api/messages/conversation/${selectedConversation._id}`)
      setMessages(response.data.data || [])
    } catch (err) {
      console.error('Fetch messages error:', err)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const response = await axios.post(`${BACKEND_URL}/api/messages/send`, {
        conversationId: selectedConversation._id,
        senderId: user._id,
        senderRole: 'admin',
        senderName: user.name || 'Admin',
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
    <div className="w-full h-full flex">
      {/* Conversations List */}
      <div className="w-80 bg-gray-900/50 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-black text-white">💬 Messages</h1>
          <p className="text-gray-400 text-sm mt-1">Customer inquiries</p>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No conversations yet</p>
            </div>
          ) : (
            conversations.map((convo) => (
              <button
                key={convo._id}
                onClick={() => setSelectedConversation(convo)}
                className={`w-full text-left p-4 border-b border-gray-800 hover:bg-gray-800/50 transition ${
                  selectedConversation?._id === convo._id ? 'bg-gray-800/50 border-l-2 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{convo.customerName}</p>
                    <p className="text-gray-400 text-xs truncate">{convo.customerEmail}</p>
                    <p className="text-gray-500 text-xs mt-1 truncate">{convo.lastMessage}</p>
                  </div>
                  {convo.unreadCount > 0 && (
                    <span className="bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {convo.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-gray-900/50 backdrop-blur-xl flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">{selectedConversation.customerName}</h2>
                <p className="text-gray-400 text-sm">{selectedConversation.customerEmail}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <p>No messages yet</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.senderRole === 'admin'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-100'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${msg.senderRole === 'admin' ? 'text-blue-100' : 'text-gray-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString()}
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
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
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
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p className="text-lg">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminChat
