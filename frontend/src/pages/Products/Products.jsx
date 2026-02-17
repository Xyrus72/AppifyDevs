import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import shwapnoProducts from '../../data/shwapno_products.json'

const Products = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [cart, setCart] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [products, setProducts] = useState(shwapnoProducts)

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem('shoppingCart')
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart))
        } catch (e) {
          console.error('Error loading cart:', e)
          setCart([])
        }
      } else {
        setCart([])
      }
    }

    loadCart()

    // Listen for cart updates (including clear cart from checkout)
    const handleCartUpdate = () => {
      loadCart()
    }

    window.addEventListener('cartUpdated', handleCartUpdate)
    return () => window.removeEventListener('cartUpdated', handleCartUpdate)
  }, [])

  const addToCart = (product) => {
    if (product.quantity <= 0) {
      alert('This product is out of stock')
      return
    }
    // Decrease quantity when added to cart
    const updatedProducts = products.map(p => 
      p.id === product.id 
        ? { ...p, quantity: p.quantity - 1 }
        : p
    )
    setProducts(updatedProducts)
    const updatedCart = [...cart, { ...product, quantity: product.quantity - 1 }]
    setCart(updatedCart)
    // Save to localStorage and trigger storage event for navbar
    localStorage.setItem('shoppingCart', JSON.stringify(updatedCart))
    // Dispatch custom event to notify Navbar of cart change
    window.dispatchEvent(new Event('cartUpdated'))
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
          <p className="text-xl text-gray-300">
            Welcome, <span className="font-bold text-cyan-400">{user?.name}</span> 👋
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
                    <div className="flex items-center justify-between mt-auto gap-4">
                      <div>
                        <p className="text-2xl font-black text-cyan-400">{product.price}</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Stock: <span className={product.quantity > 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                            {product.quantity > 0 ? product.quantity : 'Out of Stock'}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.quantity <= 0}
                        className={`font-bold transition transform hover:scale-105 shadow-lg px-4 py-2 rounded-lg ${
                          product.quantity > 0 
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white' 
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {product.quantity > 0 ? '🛒 Add' : '❌ Out'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Products
