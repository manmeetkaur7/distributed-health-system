import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const getStoredUser = () => ({
  token: localStorage.getItem('token'),
  userId: localStorage.getItem('userId'),
  name: localStorage.getItem('userName'),
  email: localStorage.getItem('userEmail'),
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)

  const saveAuth = (authData) => {
    localStorage.setItem('token', authData.token)
    localStorage.setItem('userId', authData._id)
    localStorage.setItem('userName', authData.name)
    localStorage.setItem('userEmail', authData.email)

    setUser({
      token: authData.token,
      userId: authData._id,
      name: authData.name,
      email: authData.email,
    })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    setUser({
      token: null,
      userId: null,
      name: null,
      email: null,
    })
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user.token && user.userId),
      saveAuth,
      logout,
    }),
    [user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
