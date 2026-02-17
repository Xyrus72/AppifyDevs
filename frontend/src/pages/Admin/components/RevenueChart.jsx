import React from 'react'

/**
 * RevenueChart Component
 * Displays a simple bar chart for monthly revenue
 * Can be extended with libraries like Chart.js or Recharts
 */
const RevenueChart = ({ data = [] }) => {
  // Sample data if none provided
  const chartData = data.length > 0 ? data : [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 },
    { month: 'Jul', revenue: 72000 },
    { month: 'Aug', revenue: 78000 },
    { month: 'Sep', revenue: 85000 },
    { month: 'Oct', revenue: 92000 },
    { month: 'Nov', revenue: 88000 },
    { month: 'Dec', revenue: 95000 }
  ]

  const maxRevenue = Math.max(...chartData.map(d => d.revenue))

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-8 border border-gray-700 shadow-lg">
      <h3 className="text-2xl font-black text-white mb-8">📊 Monthly Revenue</h3>
      
      <div className="flex items-end justify-between gap-2 h-64">
        {chartData.map((item, idx) => {
          const heightPercent = (item.revenue / maxRevenue) * 100
          return (
            <div key={idx} className="flex-1 flex flex-col items-center group">
              <div className="relative h-full w-full flex items-end justify-center mb-2">
                <div 
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-500 rounded-t-lg opacity-80 hover:opacity-100 transition duration-300 cursor-pointer"
                  style={{ height: `${heightPercent}%` }}
                >
                  <div className="absolute -top-8 opacity-0 group-hover:opacity-100 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded whitespace-nowrap transition duration-300">
                    ৳{(item.revenue / 1000).toFixed(1)}K
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-400 font-semibold">{item.month}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RevenueChart
