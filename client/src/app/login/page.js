"use client"
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/navigation'
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { useAuth } from '../context/context'

const page = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const { login, error, loading, setError } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        const res = await login(email, password)

        if (res?.token) {
            router.push('/users')
        }

        setTimeout(() => {
            setError(null)
        }, 2000)
    }

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 2000)
            return () => clearTimeout(timer)
        }
    }, [error, setError])

    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <div className="min-h-screen flex">
                <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-600 to-blue-500 items-center justify-center p-12">
                    <div className="text-white text-center">
                        <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
                        <p className="text-lg">Login to access your dashboard.</p>
                    </div>
                </div>

                <div className="flex w-full md:w-1/2 justify-center items-center p-8">
                    <div className="w-full max-w-md">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Login</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-500"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash className="h-5 w-5" />
                                        ) : (
                                            <FaEye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {error && <p className="text-red-600 text-sm">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-300"
                            >
                                {loading ? 'Logging In...' : 'Log In'}
                            </button>

                            <p className="text-sm text-center text-gray-600 mt-4">
                                Don&apos;t have an account?{' '}
                                <a href="/signup" className="text-indigo-500 hover:underline">
                                    Sign Up
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default page