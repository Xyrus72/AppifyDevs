import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const Navbar = () => {
  const { user, role, balance, logout } = useAuth()
  const [cart, setCart] = useState([])
  const [cartTotal, setCartTotal] = useState(0)
  const [showProfile, setShowProfile] = useState(false)
  const profileRef = useRef(null)

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('shoppingCart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setCart(parsedCart)
        const total = parsedCart.reduce((sum, item) => {
          const price = typeof item.price === 'string' 
            ? parseInt(item.price.replace(/[^\d]/g, '')) 
            : item.price
          return sum + price
        }, 0)
        setCartTotal(total)
      } catch (e) {
        console.error('Error loading cart:', e)
      }
    }
  }, [])

  const handleLogout = () => {
    logout()
  }

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Listen for cart updates from other components
  useEffect(() => {
    const updateCart = () => {
      const savedCart = localStorage.getItem('shoppingCart')
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          setCart(parsedCart)
          const total = parsedCart.reduce((sum, item) => {
            const price = typeof item.price === 'string' 
              ? parseInt(item.price.replace(/[^\d]/g, '')) 
              : item.price
            return sum + price
          }, 0)
          setCartTotal(total)
        } catch (e) {
          console.error('Error updating cart:', e)
        }
      }
    }

    // Listen for custom cart update event
    window.addEventListener('cartUpdated', updateCart)
    
    // Also listen for storage changes from other tabs/windows
    window.addEventListener('storage', updateCart)

    return () => {
      window.removeEventListener('cartUpdated', updateCart)
      window.removeEventListener('storage', updateCart)
    }
  }, [])

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-8 py-5 bg-gray-950/95 backdrop-blur-md shadow-2xl border-b border-gray-800">
      <Link to="/" className="text-4xl font-black text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text hover:opacity-80 transition duration-300">
        ShopHub
      </Link>
      <div className="hidden md:flex gap-10 font-semibold">
        <Link to="/" className="text-gray-300 hover:text-blue-400 transition duration-300 text-lg">Home</Link>
        {user && <Link to="/products" className="text-gray-300 hover:text-purple-400 transition duration-300 text-lg">Products</Link>}
        <a href="#" className="text-gray-300 hover:text-cyan-400 transition duration-300 text-lg">About</a>
        <a href="#" className="text-gray-300 hover:text-pink-400 transition duration-300 text-lg">Contact</a>
      </div>
      <div className="flex gap-4 items-center">
        {/* Cart Summary - Only show when signed in */}
        {user && (
          <Link 
            to="/checkout" 
            state={{ cart }}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg font-bold transition transform hover:scale-105 shadow-lg flex items-center gap-2"
          >
            <span>🛒 {cart.length}</span>
            <span className="text-sm">৳{cartTotal}</span>
          </Link>
        )}
        {user && (
          <>
            {/* Wallet Balance */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-4 py-2 rounded-lg font-bold transition transform hover:scale-105 shadow-lg flex items-center gap-2">
              <span>💰</span>
              <span className="hidden sm:inline">৳{balance.toLocaleString()}</span>
            </div>
            <Link 
              to={role === 'admin' ? '/admin-dashboard' : '/customer-dashboard'}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white px-4 py-2 rounded-lg font-bold transition transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <span>📊</span>
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </>
        )}
        {user ? (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-3 rounded-lg font-bold transition transform hover:scale-105 shadow-lg"
            >
              <span>{role === 'admin' ? '👑' : '👤'}</span>
              <span className="hidden sm:inline">{user.name}</span>
              <span className="text-sm">▼</span>
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-80 bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-xl shadow-2xl p-6 z-50">
                <div className="space-y-4">
                  {/* User Header */}
                  <div className="border-b border-gray-700 pb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-4xl">{role === 'admin' ? '👑' : '👤'}</div>
                      <div>
                        <p className="text-white font-bold text-lg">{user.name}</p>
                        <p className="text-cyan-400 text-sm font-semibold uppercase">{role}</p>
                      </div>
                    </div>
                  </div>

                  {/* User Information */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-xs font-semibold uppercase">Email</p>
                      <p className="text-white text-sm break-all">{user.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-xs font-semibold uppercase">Account Type</p>
                      <p className="text-white text-sm capitalize">{role === 'admin' ? 'Administrator' : 'Customer'}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-xs font-semibold uppercase">Account Status</p>
                      <p className="text-green-400 text-sm font-bold">✓ Active</p>
                    </div>

                    {!role ? null : role === 'customer' && (
                      <div>
                        <p className="text-gray-400 text-xs font-semibold uppercase">Wallet Balance</p>
                        <p className="text-green-400 text-lg font-bold">৳{balance.toLocaleString()}</p>
                      </div>
                    )}

                    {user.uid && (
                      <div>
                        <p className="text-gray-400 text-xs font-semibold uppercase">User ID</p>
                        <p className="text-gray-300 text-xs font-mono break-all">{user.uid}</p>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-700 pt-4">
                    <button
                      onClick={() => {
                        handleLogout()
                        setShowProfile(false)
                      }}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-2 rounded-lg font-bold transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/signin" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-500 hover:to-purple-500 transition font-bold text-lg shadow-lg transform hover:scale-105">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
