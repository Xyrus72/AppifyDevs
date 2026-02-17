import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { getAuthHeaders } from '../../services/authService'

const Checkout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, balance, updateBalance } = useAuth()
  const initialCart = location.state?.cart || []
  const [cart, setCart] = useState(initialCart)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: user?.email || '',
    fullName: user?.name || '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  })

  // Update localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
  }, [cart])

  // Helper function to extract numeric price from string
  const parsePrice = (priceStr) => {
    if (typeof priceStr === 'number') return priceStr
    const numStr = priceStr.replace(/[^\d]/g, '')
    return parseInt(numStr) || 0
  }

  // Group cart items by product name and count
  const groupedCart = cart.reduce((acc, item) => {
    const existing = acc.find(i => i.name === item.name)
    if (existing) {
      existing.count += 1
      existing.subtotal += parsePrice(item.price)
    } else {
      acc.push({
        ...item,
        count: 1,
        subtotal: parsePrice(item.price)
      })
    }
    return acc
  }, [])

  const totalAmount = groupedCart.reduce((sum, item) => sum + item.subtotal, 0)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      // Clear cart state
      setCart([])
      // Clear localStorage
      localStorage.removeItem('shoppingCart')
      // Dispatch event to update navbar
      window.dispatchEvent(new Event('cartUpdated'))
      // Navigate back to products with empty cart
      navigate('/products', { replace: true })
    }
  }

  const handleReduceQuantity = (productName) => {
    // Remove only 1 item of this product
    const index = cart.findIndex(item => item.name === productName)
    if (index !== -1) {
      const updatedCart = cart.filter((_, i) => i !== index)
      setCart(updatedCart)
    }
  }

  const handleRemoveAll = (productName) => {
    // Remove all items of this product
    const updatedCart = cart.filter(item => item.name !== productName)
    setCart(updatedCart)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Check if user has sufficient balance
      if (balance < totalAmount) {
        setError(`Insufficient balance! You need ৳${totalAmount - balance} more.`)
        setLoading(false)
        return
      }

      // Send order directly without using the cart system
      // This allows ordering with local product data
      const orderResponse = await fetch('http://localhost:5000/api/orders/direct', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          items: cart.map(item => ({
            name: item.name,
            price: typeof item.price === 'string' ? parseInt(item.price.replace(/[^\d]/g, '')) : item.price,
            quantity: 1,
            image: item.image_url
          })),
          shippingAddress: {
            fullName: formData.fullName,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            phone: formData.phone
          },
          totalAmount,
          email: formData.email,
          paymentMethod: 'wallet'
        })
      })

      if (orderResponse.ok) {
        const order = await orderResponse.json()
        // Update balance after successful order
        const newBalance = balance - totalAmount
        updateBalance(newBalance)
        
        // Clear cart
        setCart([])
        localStorage.removeItem('shoppingCart')
        window.dispatchEvent(new Event('cartUpdated'))
        
        navigate('/customer-dashboard', { 
          state: { 
            message: 'Order placed successfully!',
            orderId: order.data?._id || order._id
          } 
        })
      } else {
        const error = await orderResponse.json()
        setError('Error placing order: ' + (error.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setError('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="w-full bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">Your cart is empty</h1>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-bold transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
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
          <h1 className="text-6xl font-black mb-4 text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text">Checkout</h1>
          <p className="text-xl text-gray-300">Complete your purchase, {user?.name} 👋</p>
        </div>
      </section>

      {/* Cart Summary Header - Sticky at Top */}
      <section className="sticky top-0 z-40 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-b border-blue-500/40 backdrop-blur-md px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm font-semibold">Items</p>
                <p className="text-3xl font-black text-cyan-400">{cart.length}</p>
              </div>
              <div className="w-px h-12 bg-gray-700"></div>
              <div className="text-center">
                <p className="text-gray-400 text-sm font-semibold">Total</p>
                <p className="text-3xl font-black text-green-400">৳{totalAmount.toLocaleString()}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-bold transition transform hover:scale-105 shadow-lg"
            >
              Add More Items
            </button>
            <button
              onClick={handleClearCart}
              className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-lg font-bold transition transform hover:scale-105 shadow-lg"
            >
              Clear Cart
            </button>
          </div>
          {/* Items Summary Table */}
          <div className="mt-6 pt-6 border-t border-blue-500/40">
            <div className="bg-gray-900/40 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-blue-600/30 border-b border-blue-500/40">
                  <tr>
                    <th className="text-left px-4 py-3 font-bold text-cyan-400">Product</th>
                    <th className="text-center px-4 py-3 font-bold text-cyan-400">Qty</th>
                    <th className="text-right px-4 py-3 font-bold text-cyan-400">Price</th>
                    <th className="text-right px-4 py-3 font-bold text-green-400">Subtotal</th>
                    <th className="text-center px-4 py-3 font-bold text-red-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedCart.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/40 transition">
                      <td className="px-4 py-3 text-gray-300 max-w-xs truncate">{item.name}</td>
                      <td className="text-center px-4 py-3 text-cyan-300 font-bold">x{item.count}</td>
                      <td className="text-right px-4 py-3 text-gray-400">৳{parsePrice(item.price).toLocaleString()}</td>
                      <td className="text-right px-4 py-3 text-green-400 font-bold">৳{item.subtotal.toLocaleString()}</td>
                      <td className="text-center px-4 py-3">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleReduceQuantity(item.name)}
                            className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded font-bold transition text-sm"
                          >
                            − Remove 1
                          </button>
                          <button
                            onClick={() => handleRemoveAll(item.name)}
                            className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded font-bold transition text-sm"
                          >
                            ✕ Remove All
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Checkout Grid */}
          <div className="grid grid-cols-1 gap-8">
            {/* Checkout Form - Full Width */}
            <div>
            <form onSubmit={handleSubmit} id="checkout-form" className="space-y-8">
              {/* Error Alert */}
              {error && (
                <div className="bg-red-600/20 border border-red-500 rounded-lg p-4 text-red-300">
                  {error}
                </div>
              )}

              {/* Wallet Balance Section */}
              <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/40 rounded-2xl p-8">
                <h2 className="text-2xl font-black mb-6 text-green-400">💰 Wallet Balance</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 mb-2">Your Current Balance</p>
                    <p className="text-5xl font-black text-green-400">৳{balance.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-300 mb-2">Order Total</p>
                    <p className="text-5xl font-black text-cyan-400">৳{totalAmount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-green-500/30">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-300">After Payment</p>
                    <p className={`text-3xl font-bold ${balance - totalAmount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ৳{Math.max(0, balance - totalAmount).toLocaleString()}
                    </p>
                  </div>
                  {balance < totalAmount && (
                    <p className="text-red-400 text-sm mt-3">❌ Insufficient balance</p>
                  )}
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-gradient-to-br from-gray-900/80 to-black border border-gray-800 rounded-2xl p-8">
                <h2 className="text-2xl font-black mb-6 text-cyan-400">Shipping Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                    />
                  </div>
                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                    />
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Postal Code"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 px-8 py-4 rounded-lg font-bold transition text-lg"
                >
                  Back to Products
                </button>
                <button
                  type="submit"
                  disabled={cart.length === 0 || loading || balance < totalAmount}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed px-8 py-4 rounded-lg font-bold transition text-lg text-white"
                >
                  {loading ? 'Processing...' : balance < totalAmount ? 'Insufficient Balance' : 'Place Order'}
                </button>
              </div>
            </form>
            </div>

            {/* Order Summary - Hidden, info shown in top banner */}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Checkout
