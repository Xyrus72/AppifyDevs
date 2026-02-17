import React from 'react'

/**
 * DataTable Component
 * Reusable table component for displaying lists of items
 * Supports actions like edit, delete, and custom columns
 */
const DataTable = ({ 
  columns = [], 
  data = [], 
  onEdit = null, 
  onDelete = null,
  loading = false,
  emptyMessage = "No data found"
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-700 overflow-hidden shadow-lg">
      {/* Table Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6 border-b border-gray-700">
        <h3 className="text-xl font-black text-white">Records</h3>
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="p-12 text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-400">Loading data...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-gray-400 text-lg">{emptyMessage}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-700">
                {columns.map((col, idx) => (
                  <th 
                    key={idx} 
                    className="px-8 py-4 text-left font-bold text-gray-300 uppercase text-xs tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="px-8 py-4 text-center font-bold text-gray-300 uppercase text-xs tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item, rowIdx) => (
                <tr
                  key={item.id || rowIdx}
                  className={`border-b border-gray-800/50 transition duration-300 ${
                    rowIdx % 2 === 0 ? 'bg-gray-900/50' : 'bg-gray-950/50'
                  } hover:bg-gray-800/30`}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-8 py-6">
                      {col.render ? col.render(item) : (
                        <span className="text-gray-300">
                          {item[col.key] || 'N/A'}
                        </span>
                      )}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-8 py-6 text-center flex gap-2 justify-center">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition duration-300"
                        >
                          ✏️ Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition duration-300"
                        >
                          🗑️ Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default DataTable
