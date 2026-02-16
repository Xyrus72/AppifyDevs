import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import shwapnoProducts from '../../data/shwapno_products.json'

const Products = () => {
  const { user } = useAuth()
  const [cart, setCart] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [products, setProducts] = useState(shwapnoProducts)

  // Reload products when needed
  const reloadProducts = async () => {
    // In future, this can fetch from your Flask API
    setProducts(shwapnoProducts)
  }

  const addToCart = (product) => {
    setCart([...cart, product])
  }

  return (
    <div className="w-full bg-black text-white min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Header */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900/40 to-black border-b border-blue-500/20 py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl font-black mb-4 text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text">Shop Our Products</h1>
          <p className="text-xl text-gray-300 flex items-center gap-2 justify-between">
            <span>Welcome, <span className="font-bold text-cyan-400">{user?.name}</span> 👋</span>
            <span className="ml-auto bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 px-4 py-2 rounded-lg flex items-center gap-2">
              Cart ({cart.length}) 
              <button 
                onClick={reloadProducts}
                className="ml-4 bg-cyan-600 hover:bg-cyan-500 px-3 py-1 rounded text-sm transition"
              >
                🔄 Reload
              </button>
            </span>
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-white">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-br from-gray-900/80 to-black border border-gray-800 group-hover:border-blue-500/50 rounded-2xl overflow-hidden transition duration-300 hover:shadow-2xl h-full flex flex-col">
                  {/* Product Image */}
                  <div className="h-40 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center group-hover:scale-110 transition duration-300 overflow-hidden">
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200?text=Product+Image'
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                    
                    {/* Price & Button */}
                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-2xl font-black text-cyan-400">{product.price}</p>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-4 py-2 rounded-lg font-bold transition transform hover:scale-105 shadow-lg"
                      >
                        🛒 Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <section className="py-16 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 text-white p-12 rounded-3xl border border-green-500/50 overflow-hidden shadow-2xl">
                <h3 className="text-3xl font-black mb-4">🛒 Cart Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div>
                    <p className="text-green-100 text-sm mb-2">Total Items</p>
                    <p className="text-5xl font-black">{cart.length}</p>
                  </div>
                  <div>
                    <p className="text-green-100 text-sm mb-2">Total Amount</p>
                    <p className="text-5xl font-black">${cart.reduce((sum, p) => sum + p.price, 0)}</p>
                  </div>
                  <div className="flex items-end">
                    <button className="w-full bg-white text-green-600 px-10 py-4 rounded-xl font-bold hover:bg-green-50 transition text-lg transform hover:scale-105 shadow-lg">
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {cart.map((item, idx) => (
                    <p key={idx} className="text-green-100">
                      {item.name} - <span className="font-bold">${item.price}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Products
