import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    acceptTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    if (!formData.acceptTerms) {
      alert('Please accept the terms and conditions')
      return
    }
    
    // Register user
    console.log('📝 Registration Started...')
    console.log('User Details:', {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      role: formData.role
    })
    
    console.log('✅ Registration Successful!')
    console.log('Please sign in with your credentials')
    
    // Redirect to sign-in page
    navigate('/signin')
  }

  const handleGoogleSignUp = async () => {
    setError('')
    setLoading(true)
    try {
      await login(formData.role)
      navigate('/customer-dashboard')
    } catch (err) {
      setError('Failed to sign up with Google. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full bg-gray-950 text-white">
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-bl from-purple-600/20 to-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-tr from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Card */}
          <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-gray-700">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-2">Create Account</h1>
              <p className="text-gray-400 text-lg">Join ShopHub and start shopping today</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-2xl text-sm font-semibold">
                  {error}
                </div>
              )}

              {/* Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-3">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30 transition text-lg font-semibold text-white placeholder-gray-500"
                    required
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-3">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30 transition text-lg font-semibold text-white placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-3">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30 transition text-lg font-semibold text-white placeholder-gray-500"
                  required
                />
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-3">Register As</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="relative flex items-center cursor-pointer p-4 border-2 border-gray-700 rounded-2xl hover:border-blue-500 transition" style={{borderColor: formData.role === 'customer' ? '#3b82f6' : '#374151'}}>
                    <input
                      type="radio"
                      name="role"
                      value="customer"
                      checked={formData.role === 'customer'}
                      onChange={handleChange}
                      className="w-5 h-5 accent-blue-600"
                    />
                    <span className="ml-3 text-gray-300 font-semibold">👤 Customer</span>
                  </label>
                  <label className="relative flex items-center cursor-pointer p-4 border-2 border-gray-700 rounded-2xl hover:border-red-500 transition" style={{borderColor: formData.role === 'admin' ? '#dc2626' : '#374151'}}>
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={formData.role === 'admin'}
                      onChange={handleChange}
                      className="w-5 h-5 accent-red-600"
                    />
                    <span className="ml-3 text-gray-300 font-semibold">👑 Admin</span>
                  </label>
                </div>
              </div>

              {/* Password Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-3">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30 transition text-lg font-semibold text-white placeholder-gray-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition text-xl"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-3">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30 transition text-lg font-semibold text-white placeholder-gray-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition text-xl"
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-3 p-5 bg-blue-500/10 rounded-2xl border border-blue-500/30">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-2 border-blue-500 accent-blue-600 mt-1 cursor-pointer"
                  required
                />
                <p className="text-gray-300 font-semibold">
                  I agree to the{' '}
                  <a href="#" className="text-blue-400 hover:text-blue-300 font-bold">
                    Terms & Conditions
                  </a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-400 hover:text-blue-300 font-bold">
                    Privacy Policy
                  </a>
                </p>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg transition duration-300 transform hover:scale-105 shadow-lg"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gray-700"></div>
              <span className="text-gray-500 font-semibold">OR</span>
              <div className="flex-1 h-px bg-gray-700"></div>
            </div>

            {/* Social Register */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 border-2 border-gray-700 py-4 rounded-2xl font-bold text-gray-300 hover:bg-gray-800 hover:border-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50 transition duration-300"
              >
                <span className="text-2xl">🔵</span>
                {loading ? 'Signing up...' : 'Sign up with Google'}
              </button>
            </div>

            {/* Sign In Link */}
            <div className="text-center mt-10 pt-8 border-t border-gray-700">
              <p className="text-gray-400 font-semibold">
                Already have an account?{' '}
                <Link to="/signin" className="text-blue-400 hover:text-blue-300 font-bold transition">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
