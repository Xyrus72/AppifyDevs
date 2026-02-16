import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const Navbar = () => {
  const { user, role, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-8 py-5 bg-gray-950/95 backdrop-blur-md shadow-2xl border-b border-gray-800">
      <Link to="/" className="text-4xl font-black text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text hover:opacity-80 transition duration-300">
        ShopHub
      </Link>
      <div className="hidden md:flex gap-10 font-semibold">
        <Link to="/" className="text-gray-300 hover:text-blue-400 transition duration-300 text-lg">Home</Link>
        <a href="#" className="text-gray-300 hover:text-purple-400 transition duration-300 text-lg">Products</a>
        <a href="#" className="text-gray-300 hover:text-cyan-400 transition duration-300 text-lg">About</a>
        <a href="#" className="text-gray-300 hover:text-pink-400 transition duration-300 text-lg">Contact</a>
      </div>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="text-gray-300 font-semibold text-lg">
              {role === 'admin' ? '👑' : '👤'} {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg hover:from-red-500 hover:to-red-600 transition font-bold text-lg transform hover:scale-105 shadow-lg"
            >
              Logout
            </button>
          </>
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
