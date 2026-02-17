import React from 'react'

/**
 * Modal Component
 * Reusable modal for forms and confirmations
 */
const Modal = ({ 
  isOpen, 
  title, 
  onClose, 
  children, 
  size = 'md'
}) => {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition duration-300">
      <div className={`bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-700 shadow-2xl ${sizeClasses[size]} w-full mx-4`}>
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-700">
          <h2 className="text-2xl font-black text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl transition duration-300"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-96 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
