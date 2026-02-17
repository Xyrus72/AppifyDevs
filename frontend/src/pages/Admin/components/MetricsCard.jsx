import React from 'react'

/**
 * MetricsCard Component
 * Displays key metrics with icon, value, label, and change indicator
 * Used in Admin Dashboard for revenue, sales, profit, etc.
 */
const MetricsCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  isPositive = true, 
  currency = false,
  backgroundColor = 'from-blue-600 to-blue-700'
}) => {
  return (
    <div className={`bg-gradient-to-br ${backgroundColor} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition duration-300`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-200 text-sm font-semibold uppercase tracking-wider">{title}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-4xl font-black">
              {currency && '৳'} {value.toLocaleString()}
            </p>
            {change && (
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                isPositive 
                  ? 'bg-green-500/30 text-green-200' 
                  : 'bg-red-500/30 text-red-200'
              }`}>
                {isPositive ? '↑' : '↓'} {change}%
              </span>
            )}
          </div>
        </div>
        <div className="text-5xl opacity-20">{icon}</div>
      </div>
    </div>
  )
}

export default MetricsCard
