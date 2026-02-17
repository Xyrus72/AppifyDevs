import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, emailLogin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Sign in with email and password
      // Note: Role is determined from database, not from form selection
      const result = await emailLogin(email, password)
      const finalRole = result?.role
      navigate(finalRole === 'admin' ? '/admin/dashboard' : '/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)
    try {
      console.log('🔵 Google Sign-In button clicked');
      console.log('Calling login function...');
      // Note: Role is determined from database, not from form selection
      const result = await login();
      console.log('✅ Login successful:', result);
      const finalRole = result?.role
      navigate(finalRole === 'admin' ? '/admin/dashboard' : '/dashboard')
    } catch (err) {
      console.error('❌ Google Sign-In Error:', err);
      const errorMessage = err?.message || 'Failed to sign in with Google. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full bg-gray-950 text-white">
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-gray-700">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-black text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-2">Welcome Back</h1>
              <p className="text-gray-400 text-lg">Sign in to your ShopHub account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-2xl text-sm font-semibold">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-3">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30 transition text-lg font-semibold text-white placeholder-gray-500"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-3">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              {/* Remember Me & Forgot Password */}
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-2 border-gray-600 accent-blue-600" />
                  <span className="text-gray-400 font-semibold">Remember me</span>
                </label>
                <a href="#" className="text-blue-400 hover:text-blue-300 font-semibold transition">Forgot?</a>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg transition duration-300 transform hover:scale-105 shadow-lg"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gray-700"></div>
              <span className="text-gray-500 font-semibold">OR</span>
              <div className="flex-1 h-px bg-gray-700"></div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 border-2 border-gray-700 py-4 rounded-2xl font-bold text-gray-300 hover:bg-gray-800 hover:border-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50 transition duration-300"
              >
                <span className="text-2xl">🔵</span>
                {loading ? 'Signing in...' : 'Sign in with Google'}
              </button>
            </div>

            {/* Register Link */}
            <div className="text-center mt-8 pt-8 border-t border-gray-700">
              <p className="text-gray-400 font-semibold">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-400 hover:text-blue-300 font-bold transition">
                  Create one now
                </Link>
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-gray-500 text-sm mt-8">
            By signing in, you agree to our{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300 font-semibold">
              Terms & Conditions
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignIn
