'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [users, setUsers] = useState([])
    const [isAuthReady, setIsAuthReady] = useState(false)

    useEffect(() => {
        const savedToken = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user');
        if (savedToken && savedUser) {
            setToken(savedToken)
            setUser(JSON.parse(savedUser));
        }
        setIsAuthReady(true)
    }, [])

    const register = async (name, email, password, role) => {
        setLoading(true)
        setError(null)
        try {
            const res = await axios.post('http://localhost:3500/api/auth/register', {
                name, email, password, role,
            })
            console.log(res.data)
            return res.data
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        setLoading(true)
        setError(null)
        try {
            const res = await axios.post('http://localhost:3500/api/auth/login', {
                email, password,
            })
            const { token, role } = res.data
            setToken(token)
            localStorage.setItem('token', token)
            const userInfo = { email, role }
            setUser(userInfo)
            localStorage.setItem('user', JSON.stringify(userInfo))
            return res.data
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    const getUsers = async () => {
        setLoading(true)
        setError(null)
        try {
            console.log("Tojen In Get Users API:", token)
            const res = await axios.get('http://localhost:3500/api/dashboard/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setUsers(res.data.users)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch users')
        } finally {
            setLoading(false)
        }
    }

    const deleteUser = async (id) => {
        try {
            await axios.put(`http://localhost:3500/api/dashboard/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setUsers(prev => prev.filter(u => u._id !== id))
            getUsers()
            return true
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete user')
        }
    }

    const updateUser = async (id, updatedData) => {
        try {
            console.log("troken", token)
            const res = await axios.patch(`http://localhost:3500/api/dashboard/users/${id}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` },
            })

            console.log("Response update user:", res.data)
            setUsers(prev => prev.map(u => u._id === id ? res.data : u))
            return res.data
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update user')
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthReady,
                register,
                login,
                logout,
                getUsers,
                deleteUser,
                updateUser,
                users,
                loading,
                error,
                setError
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
