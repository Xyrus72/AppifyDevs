import React, { useState, useEffect, useRef } from 'react'
import { BACKEND_URL } from '../../services/authService'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

const CentralChat = () => {
  const { user, role } = useAuth()
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const [lastAdminMessageId, setLastAdminMessageId] = useState(null)

  useEffect(() => {
    if (role === 'admin') {
      fetchAllConversations()
      const interval = setInterval(fetchAllConversations, 1000)
      return () => clearInterval(interval)
    } else {
      // Customer - get their single conversation
      initializeCustomerConversation()
      const interval = setInterval(initializeCustomerConversation, 3000)
      return () => clearInterval(interval)
    }
  }, [user, role])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages()
      const interval = setInterval(fetchMessages, 1000)
      return () => clearInterval(interval)
    }
  }, [selectedConversation])

  // Only scroll when admin sends a new message (for customers) or when loading new messages
  useEffect(() => {
    if (messages.length === 0) return
    
    const lastMessage = messages[messages.length - 1]
    
    // For customers: only auto-scroll if the last message is from admin
    if (role === 'customer' && lastMessage?.senderRole === 'admin') {
      if (lastMessage._id !== lastAdminMessageId) {
        scrollToBottom()
        setLastAdminMessageId(lastMessage._id)
      }
    }
    // For admin: auto-scroll on new messages
    else if (role === 'admin') {
      scrollToBottom()
    }
  }, [messages])

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  const fetchAllConversations = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/messages/admin/conversations`)
      setConversations(response.data.data || [])
    } catch (err) {
      console.error('Fetch conversations error:', err)
    }
  }

  const initializeCustomerConversation = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${BACKEND_URL}/api/messages/customer/${user._id}`)
      const conversation = response.data.data
      setConversations([conversation])
      if (!selectedConversation && conversation) {
        setSelectedConversation(conversation)
      }
      setLoading(false)
    } catch (err) {
      console.error('Fetch customer conversation error:', err)
      setLoading(false)
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
        senderRole: role,
        senderName: role === 'admin' ? 'Admin' : (user.name || 'Customer'),
        senderEmail: user.email,
        message: newMessage
      })

      setMessages([...messages, response.data.data])
      setNewMessage('')
      
      // Immediately refresh messages and conversations for both roles
      setTimeout(() => {
        fetchMessages()
        if (role === 'admin') {
          fetchAllConversations()
        }
      }, 100)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send message')
    }
  }

  if (role === 'customer') {
    // Customer View - Full Page Chat
    return (
      <div className="w-full h-screen bg-gray-950 text-white flex flex-col fixed inset-0">
        {/* Chat Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 shadow-lg flex-shrink-0">
          <h1 className="text-3xl font-bold text-white">💬 Support Chat</h1>
          <p className="text-blue-100 text-sm mt-1">Chat with our support team</p>
        </div>

        {loading && !selectedConversation ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin text-5xl mb-4">⟳</div>
              <p className="text-gray-400">Loading...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-6xl mb-4">👋</p>
                    <p className="text-2xl font-semibold text-gray-300 mb-2">Welcome to Support</p>
                    <p className="text-gray-500">Start a conversation below</p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg._id} className={`flex ${msg.senderRole === 'customer' ? 'justify-end' : 'justify-start'}`}>
                    {msg.senderRole === 'admin' && (
                      <div className="w-full">
                        <p className="text-xs font-bold text-cyan-400 ml-2 mb-1">👨‍💼 {msg.senderName}</p>
                        <div className="flex justify-start">
                          <div className="max-w-2xl px-5 py-3 rounded-xl text-sm bg-gray-800 text-gray-100 rounded-bl-none shadow-md border border-gray-700">
                            <p className="break-words text-base leading-relaxed">{msg.message}</p>
                            <p className="text-xs mt-2 opacity-60">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {msg.senderRole === 'customer' && (
                      <div className="max-w-2xl px-5 py-3 rounded-xl text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none shadow-lg">
                        <p className="text-xs font-semibold opacity-70 mb-1">You</p>
                        <p className="break-words text-base leading-relaxed">{msg.message}</p>
                        <p className="text-xs mt-2 opacity-60">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm flex-shrink-0">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border-2 border-gray-700 rounded-full text-white placeholder-gray-500 bg-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition text-base"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-full transition shadow-lg hover:shadow-blue-500/50 text-base flex-shrink-0"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  // Admin View - All Conversations
  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white flex overflow-hidden">
      {/* Conversations List */}
      <div className="w-80 bg-gray-800/30 border-r border-gray-700 flex flex-col shadow-xl">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg">
          <h1 className="text-3xl font-bold text-white">💬 Chats</h1>
          <p className="text-blue-100 text-sm mt-1">{conversations.length} customer{conversations.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : (
            conversations.map((convo) => (
              <button
                key={convo._id}
                onClick={() => setSelectedConversation(convo)}
                className={`w-full text-left p-4 border-b border-gray-700/50 transition hover:bg-gray-700/40 ${
                  selectedConversation?._id === convo._id ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{convo.customerName}</p>
                    <p className="text-gray-400 text-xs truncate">{convo.customerEmail}</p>
                    <p className="text-gray-500 text-xs mt-1 truncate leading-relaxed">{convo.lastMessage || 'No messages yet'}</p>
                  </div>
                  {convo.unreadCount > 0 && (
                    <div className="flex-shrink-0">
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
                        {convo.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-gray-900/50 backdrop-blur-sm flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-6 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border-b border-gray-700 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                  {selectedConversation.customerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedConversation.customerName}</h2>
                  <p className="text-gray-400 text-sm">{selectedConversation.customerEmail}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 py-16">
                  <p className="text-lg font-semibold mb-2">👋 Start the conversation</p>
                  <p className="text-sm">Send a message to begin helping this customer</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-sm px-4 py-3 rounded-xl ${
                        msg.senderRole === 'admin'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none shadow-lg'
                          : 'bg-gray-800 text-gray-100 rounded-bl-none shadow-md border border-gray-700'
                      }`}
                    >
                      <p className="text-xs font-semibold opacity-70 mb-1">
                        {msg.senderName}
                      </p>
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                      <p className={`text-xs mt-2 opacity-60`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-5 bg-gray-800/50 border-t border-gray-700">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 bg-gray-900 border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-full transition shadow-lg hover:shadow-blue-500/50"
                >
                  📤
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-2xl mb-2">👈</p>
              <p className="text-lg font-semibold">Select a conversation</p>
              <p className="text-sm mt-1">Choose a customer to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CentralChat
