import React from 'react'

const OrderTimeline = ({ order }) => {
  const timelineSteps = [
    {
      status: 'pending',
      label: 'Order Placed',
      icon: '📦',
      description: 'Your order has been confirmed'
    },
    {
      status: 'confirmed',
      label: 'Order Confirmed',
      icon: '✓',
      description: 'Shop is preparing your items'
    },
    {
      status: 'processing',
      label: 'Processing',
      icon: '⚙️',
      description: 'Items are being packed'
    },
    {
      status: 'shop-to-delivery',
      label: 'Ready for Pickup',
      icon: '🚚',
      description: 'Waiting for delivery boy to collect'
    },
    {
      status: 'in-transit',
      label: 'In Transit',
      icon: '🚗',
      description: 'Delivery boy is on the way to your location'
    },
    {
      status: 'out-for-delivery',
      label: 'Out for Delivery',
      icon: '📍',
      description: 'Your order is arriving soon'
    },
    {
      status: 'delivered',
      label: 'Delivered',
      icon: '✓✓',
      description: 'Order delivered successfully'
    }
  ]

  // Get the current step index based on order status
  const currentStepIndex = timelineSteps.findIndex(step => step.status === order.status)

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-black border border-gray-800 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-8">
        <h3 className="text-2xl font-black text-cyan-400">📍 Delivery Timeline</h3>
        <span className="px-3 py-1 bg-blue-600/30 border border-blue-500 rounded-full text-blue-300 text-sm font-bold">
          {order.status.toUpperCase()}
        </span>
      </div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-[24px] top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 opacity-30"></div>

        {/* Timeline Steps */}
        <div className="space-y-8 pl-24">
          {timelineSteps.map((step, index) => {
            const isCompleted = index <= currentStepIndex
            const isCurrent = index === currentStepIndex
            
            return (
              <div key={step.status} className="relative">
                {/* Timeline Dot */}
                <div className={`absolute -left-24 top-2 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold transition-all ${
                  isCompleted
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-500 border border-gray-700'
                }`}>
                  {step.icon}
                </div>

                {/* Step Content */}
                <div className={`p-4 rounded-lg border transition-all ${
                  isCurrent
                    ? 'bg-cyan-500/20 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                    : isCompleted
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-gray-900/40 border-gray-700'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`font-bold text-lg ${
                        isCompleted ? 'text-cyan-400' : 'text-gray-300'
                      }`}>
                        {step.label}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">{step.description}</p>
                    </div>
                    {isCompleted && (
                      <span className={`text-2xl font-bold ${
                        isCurrent ? 'animate-pulse text-cyan-400' : 'text-green-400'
                      }`}>
                        {isCurrent ? '⚡' : '✓'}
                      </span>
                    )}
                  </div>

                  {/* Timestamp */}
                  {order.timeline && order.timeline.find(t => t.status === step.status) && (
                    <div className="mt-3 pt-3 border-t border-gray-700/50">
                      <p className="text-xs text-gray-500">
                        {new Date(
                          order.timeline.find(t => t.status === step.status).timestamp
                        ).toLocaleDateString()} at{' '}
                        {new Date(
                          order.timeline.find(t => t.status === step.status).timestamp
                        ).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {order.timeline.find(t => t.status === step.status).location && (
                        <p className="text-xs text-gray-400 mt-1">
                          📍 {order.timeline.find(t => t.status === step.status).location}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Estimated Delivery */}
      {order.status !== 'delivered' && (
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-300 text-sm">
              <span className="font-bold">⏱️ Estimated Delivery:</span> Today by 6 PM
            </p>
          </div>
        </div>
      )}

      {/* Delivered Message */}
      {order.status === 'delivered' && (
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4 text-center">
            <p className="text-green-400 font-bold text-lg">🎉 Order Delivered Successfully!</p>
            <p className="text-green-300 text-sm mt-2">Thank you for your purchase. Enjoy your items!</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderTimeline
