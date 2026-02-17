import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getAuthHeaders, BACKEND_URL } from '../../services/authService'

const NewlyArrived = () => {
  const { user } = useAuth()
  const [cart, setCart] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${BACKEND_URL}/api/products`, {
          headers: getAuthHeaders()
        })
        
        if (response.ok) {
          const data = await response.json()
          const fetchedProducts = data.products || data.data || []
          
          // Map database fields to component fields
          const mappedProducts = fetchedProducts.map(p => ({
            id: p._id,
            name: p.name,
            description: p.description,
            price: p.price,
            quantity: p.stock || 0,
            image_url: p.imageURL,
            category: p.category,
            isActive: p.isActive,
            createdAt: p.createdAt
          }))
          
          // Filter only active products and sort by newest first
          const activeProducts = mappedProducts
            .filter(p => p.isActive !== false)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          
          setProducts(activeProducts)
        } else {
          console.error('Failed to fetch products')
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

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

    // Listen for cart updates
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
    
    // Decrease quantity when added to cart (same as Products page)
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
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-green-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-emerald-600/20 to-green-600/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Header */}
      <section className="relative bg-gradient-to-br from-slate-900 via-green-900/40 to-black border-b border-green-500/20 py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl font-black mb-4 text-transparent bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 bg-clip-text">🆕 Newly Arrived</h1>
          <p className="text-xl text-gray-300">
            Discover the latest products added to ShopHub!
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin text-5xl mb-4">⟳</div>
                <p className="text-gray-400">Loading newly arrived products...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No newly arrived products yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative bg-gradient-to-br from-gray-900/80 to-black border border-gray-800 group-hover:border-green-500/50 rounded-2xl overflow-hidden transition duration-300 hover:shadow-2xl hover:shadow-green-500/20 h-full flex flex-col">
                    {/* New Badge */}
                    <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      ✨ NEW
                    </div>

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
                      <p className="text-gray-400 text-sm mb-2">{product.description}</p>
                      <p className="text-xs text-gray-500 mb-4">Category: <span className="text-green-400">{product.category}</span></p>
                      
                      {/* Price & Button */}
                      <div className="flex items-center justify-between mt-auto gap-4">
                        <div>
                          <p className="text-2xl font-black text-green-400">৳{product.price}</p>
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
                              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white' 
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
          )}
        </div>
      </section>
    </div>
  )
}

export default NewlyArrived
