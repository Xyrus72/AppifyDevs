import React, { useState } from 'react'

/**
 * Email Marketing Page
 * Features: Send bulk emails to multiple recipients
 * Supports email addresses input, subject line, content, and image attachments
 */
const EmailMarketing = () => {
  const [emailList, setEmailList] = useState('')
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [attachedImage, setAttachedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isSending, setIsSending] = useState(false)
  const [sentStatus, setSentStatus] = useState(null)
  const [campaignHistory, setCampaignHistory] = useState([
    {
      id: 1,
      subject: 'Summer Sale 2024',
      recipients: 1250,
      sent: '2024-02-14',
      status: 'Delivered'
    },
    {
      id: 2,
      subject: 'New Collection Announcement',
      recipients: 980,
      sent: '2024-02-10',
      status: 'Delivered'
    }
  ])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5242880) { // 5MB limit
        alert('❌ Image size must be less than 5MB')
        return
      }
      setAttachedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const parseEmails = (text) => {
    return text
      .split(/[,;\n]/)
      .map(email => email.trim())
      .filter(email => email && email.includes('@'))
  }

  const handleSendCampaign = async () => {
    const emails = parseEmails(emailList)

    if (emails.length === 0) {
      alert('❌ Please enter at least one valid email address')
      return
    }

    if (!subject.trim()) {
      alert('❌ Please enter a subject line')
      return
    }

    if (!content.trim()) {
      alert('❌ Please enter email content')
      return
    }

    setIsSending(true)
    setSentStatus(null)

    // Simulate sending email campaign
    try {
      setTimeout(() => {
        setCampaignHistory([
          {
            id: campaignHistory.length + 1,
            subject: subject,
            recipients: emails.length,
            sent: new Date().toISOString().split('T')[0],
            status: 'Delivered'
          },
          ...campaignHistory
        ])

        setSentStatus({
          success: true,
          message: `✓ Email campaign sent to ${emails.length} recipients successfully!`
        })

        // Reset form
        setEmailList('')
        setSubject('')
        setContent('')
        setAttachedImage(null)
        setImagePreview(null)

        setTimeout(() => setSentStatus(null), 5000)
        setIsSending(false)
      }, 2000)
    } catch (error) {
      setSentStatus({
        success: false,
        message: `❌ Failed to send email campaign: ${error.message}`
      })
      setIsSending(false)
    }
  }

  const emailCount = parseEmails(emailList).length

  return (
    <div className="w-full min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-2xl">
        <div className="px-8 py-6">
          <h1 className="text-4xl font-black text-white">📮 Email Marketing</h1>
          <p className="text-gray-400 text-sm mt-2">Send bulk emails to your customers</p>
        </div>
      </header>

      {/* Content */}
      <main className="p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Email Composer */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-8 border border-gray-700 shadow-lg">
              <h2 className="text-2xl font-black text-white mb-8">✉️ Email Composer</h2>

              {/* Email List Input */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  📧 Recipient Emails * ({emailCount} valid)
                </label>
                <textarea
                  value={emailList}
                  onChange={(e) => setEmailList(e.target.value)}
                  placeholder="Enter emails separated by comma, semicolon, or new line&#10;Example:&#10;john@example.com, jane@example.com&#10;alex@example.com"
                  rows="5"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition duration-300 resize-none"
                />
                <p className="text-xs text-gray-400 mt-2">Supported formats: john@example.com, jane@example.com OR one email per line</p>
              </div>

              {/* Subject Line */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-300 mb-2">📝 Subject Line *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject line"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition duration-300"
                />
              </div>

              {/* Email Content */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-300 mb-2">📄 Email Content *</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter your email message content..."
                  rows="8"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition duration-300 resize-none"
                />
                <p className="text-xs text-gray-400 mt-2">{content.length} / 5000 characters</p>
              </div>

              {/* Image Attachment */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-300 mb-2">🖼️ Attach Image (Optional)</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-red-500 transition duration-300">
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                    id="email-image"
                  />
                  <label htmlFor="email-image" className="cursor-pointer block">
                    <p className="text-gray-400 font-bold">📷 Click to upload or drag & drop</p>
                    <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 5MB</p>
                    {attachedImage && (
                      <p className="text-xs text-green-400 mt-2">✓ {attachedImage.name}</p>
                    )}
                  </label>
                </div>
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendCampaign}
                disabled={isSending || emailCount === 0}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-bold text-lg transition duration-300 shadow-lg"
              >
                {isSending ? '⏳ Sending Campaign...' : `📬 Send to ${emailCount} Recipients`}
              </button>

              {/* Status Message */}
              {sentStatus && (
                <div className={`mt-6 p-4 rounded-lg font-bold text-center ${
                  sentStatus.success
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {sentStatus.message}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Preview & History */}
          <div className="space-y-8">
            {/* Email Preview */}
            {imagePreview && (
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-gray-700 shadow-lg">
                <h3 className="text-lg font-black text-white mb-4">👁️ Image Preview</h3>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full rounded-lg max-h-48 object-cover"
                />
                <button
                  onClick={() => {
                    setAttachedImage(null)
                    setImagePreview(null)
                  }}
                  className="mt-4 w-full bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition duration-300"
                >
                  ✕ Remove Image
                </button>
              </div>
            )}

            {/* Recent Campaigns */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-gray-700 shadow-lg">
              <h3 className="text-lg font-black text-white mb-4">📊 Recent Campaigns</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {campaignHistory.map((campaign) => (
                  <div key={campaign.id} className="p-4 bg-gray-800/30 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-white text-sm">{campaign.subject}</p>
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      👥 {campaign.recipients.toLocaleString()} recipients
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      📅 {new Date(campaign.sent).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-blue-900/40 to-gray-900 rounded-2xl p-6 border border-blue-500/30">
              <h3 className="text-lg font-black text-blue-400 mb-4">💡 Tips</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>✓ Use clear, engaging subject lines</li>
                <li>✓ Keep content concise and readable</li>
                <li>✓ Use images to enhance your message</li>
                <li>✓ Test with small groups first</li>
                <li>✓ Include call-to-action buttons</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default EmailMarketing
