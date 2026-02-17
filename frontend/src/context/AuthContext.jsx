import React, { createContext, useState, useContext } from 'react'
import { googleSignIn, logoutUser, saveLoginToDatabase, emailSignUp, emailSignIn, setToken, getBackendUserByUid } from '../services/authService'

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
      setBalance(userData.balance || 1000)
      localStorage.setItem('user', JSON.stringify(userData))
      
      // Save signup to MongoDB backend and use ACTUAL role from response
      const signupResponse = await saveLoginToDatabase(userData, userRole)
      
      // Use the actual role from database, NOT the user-selected role
      let actualRole = userRole
      let backendBalance = userData.balance || 1000

      if (signupResponse && signupResponse.user) {
        actualRole = signupResponse.user.role
        backendBalance = signupResponse.user.balance || backendBalance
      }

      setRole(actualRole)
      setBalance(backendBalance)
      localStorage.setItem('role', actualRole)
      localStorage.setItem('balance', backendBalance)
      
      // Return both Firebase user and actual role so callers can route correctly
      return { user: userData, role: actualRole }
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
      setBalance(userData.balance || 1000)
      localStorage.setItem('user', JSON.stringify(userData))
      
      // Save login to MongoDB backend and use ACTUAL role from response
      const loginResponse = await saveLoginToDatabase(userData, userRole)
      
      // Use the actual role from database, NOT the user-selected role
      let actualRole = userRole
      let backendBalance = userData.balance || 1000

      if (loginResponse && loginResponse.user) {
        actualRole = loginResponse.user.role
        backendBalance = loginResponse.user.balance || backendBalance
      }

      setRole(actualRole)
      setBalance(backendBalance)
      localStorage.setItem('role', actualRole)
      localStorage.setItem('balance', backendBalance)
      
      // Return both Firebase user and actual role so callers can route correctly
      return { user: userData, role: actualRole }
    } catch (error) {
      console.error('Email login failed:', error)
      throw error
    }
  }

  // Google Login function
  const login = async (userRole = 'customer') => {
    try {
      const userData = await googleSignIn()

      // Check if this Google account already exists in our backend.
      // If not, force the user to go through the sign-up flow first.
      const existingBackendUser = await getBackendUserByUid(userData.uid)
      if (!existingBackendUser) {
        // Sign out from Firebase to avoid half-logged-in state
        await logoutUser()
        setUser(null)
        setRole(null)
        setBalance(0)
        localStorage.removeItem('user')
        localStorage.removeItem('role')
        localStorage.removeItem('balance')
        setToken(null)
        throw new Error('❌ This Google account is not registered. Please sign up first, then sign in.')
      }

      // At this point, user exists in backend → update login info and issue JWT
      setUser(userData)
      setBalance(existingBackendUser.balance || userData.balance || 1000)
      localStorage.setItem('user', JSON.stringify(userData))

      const loginResponse = await saveLoginToDatabase(userData, userRole)

      let actualRole = existingBackendUser.role || userRole
      let backendBalance = existingBackendUser.balance || userData.balance || 1000

      if (loginResponse && loginResponse.user) {
        actualRole = loginResponse.user.role || actualRole
        backendBalance = loginResponse.user.balance || backendBalance
      }

      setRole(actualRole)
      setBalance(backendBalance)
      localStorage.setItem('role', actualRole)
      localStorage.setItem('balance', backendBalance)
      
      // Return both Firebase user and actual role so callers can route correctly
      return { user: userData, role: actualRole }
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
      localStorage.removeItem('shoppingCart')
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
        localStorage.removeItem('shoppingCart')
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
