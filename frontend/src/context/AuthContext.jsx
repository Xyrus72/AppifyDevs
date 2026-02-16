import React, { createContext, useState, useContext } from 'react'
import { googleSignIn, logoutUser, getCurrentUser } from '../services/authService'

// Create Auth Context
const AuthContext = createContext()

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  // Google Login function
  const login = async (userRole = 'customer') => {
    try {
      const userData = await googleSignIn()
      setUser(userData)
      setRole(userRole)
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('role', userRole)
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
      localStorage.removeItem('user')
      localStorage.removeItem('role')
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }

  // Check if user is already logged in on mount
  React.useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
          const storedRole = localStorage.getItem('role') || 'customer'
          setRole(storedRole)
        } else {
          // Try to restore from localStorage if Firebase session expired
          const storedUser = localStorage.getItem('user')
          const storedRole = localStorage.getItem('role')
          if (storedUser && storedRole) {
            setUser(JSON.parse(storedUser))
            setRole(storedRole)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setLoading(false)
      }
    }
    initAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, role, login, logout, loading }}>
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
