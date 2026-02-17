import React, { createContext, useState, useContext } from 'react'
import { googleSignIn, logoutUser, getCurrentUser, saveLoginToDatabase, emailSignUp, emailSignIn, setToken } from '../services/authService'

// Create Auth Context
const AuthContext = createContext()

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)

  // Email sign up function
  const signup = async (firstName, lastName, email, password, userRole = 'customer') => {
    try {
      const userData = await emailSignUp(firstName, lastName, email, password)
      setUser(userData)
      setRole(userRole)
      setBalance(userData.balance || 1000)
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('role', userRole)
      localStorage.setItem('balance', userData.balance || 1000)
      
      // Save signup to MongoDB backend
      await saveLoginToDatabase(userData, userRole)
      
      return userData
    } catch (error) {
      console.error('Signup failed:', error)
      throw error
    }
  }

  // Email sign in function
  const emailLogin = async (email, password, userRole = 'customer') => {
    try {
      const userData = await emailSignIn(email, password)
      setUser(userData)
      setRole(userRole)
      setBalance(userData.balance || 1000)
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('role', userRole)
      localStorage.setItem('balance', userData.balance || 1000)
      
      // Save login to MongoDB backend
      await saveLoginToDatabase(userData, userRole)
      
      return userData
    } catch (error) {
      console.error('Email login failed:', error)
      throw error
    }
  }

  // Google Login function
  const login = async (userRole = 'customer') => {
    try {
      const userData = await googleSignIn()
      setUser(userData)
      setRole(userRole)
      setBalance(userData.balance || 1000)
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('role', userRole)
      localStorage.setItem('balance', userData.balance || 1000)
      
      // Save login to MongoDB backend
      await saveLoginToDatabase(userData, userRole)
      
      return userData
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await logoutUser()
      setUser(null)
      setRole(null)
      setBalance(0)
      localStorage.removeItem('user')
      localStorage.removeItem('role')
      localStorage.removeItem('balance')
      setToken(null)
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }

  // Update balance function
  const updateBalance = (newBalance) => {
    setBalance(newBalance)
    localStorage.setItem('balance', newBalance)
  }

  // Check if user is already logged in on mount
  React.useEffect(() => {
    const initAuth = async () => {
      try {
        // Always sign out on app load to start fresh
        await logoutUser()
        setUser(null)
        setRole(null)
        localStorage.removeItem('user')
        localStorage.removeItem('role')
        setToken(null)
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setLoading(false)
      }
    }
    initAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, role, balance, login, logout, signup, emailLogin, loading, updateBalance }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
