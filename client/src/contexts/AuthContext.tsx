'use client'

import React, { createContext, useContext } from 'react'

interface User {
  id: string
  preferred_username: string
  given_name?: string
  family_name?: string
  email?: string
}

interface AuthContextType {
  user: User | null
  authenticated: boolean
  initialized: boolean
}

// Create a mock AuthContext for diagram components
const AuthContext = createContext<AuthContextType>({
  user: null,
  authenticated: false,
  initialized: false,
})

export const useAuth = () => useContext(AuthContext)

// Simple mock provider for development purposes
export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mock user for development
  const mockUser: User = {
    id: 'mock-user-id',
    preferred_username: 'developer',
    given_name: 'Test',
    family_name: 'User',
    email: 'test@example.com',
  }

  const value: AuthContextType = {
    user: mockUser,
    authenticated: true,
    initialized: true,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
