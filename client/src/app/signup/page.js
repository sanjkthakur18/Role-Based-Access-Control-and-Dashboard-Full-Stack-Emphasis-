'use client'
import React, { useState } from 'react'
import Head from 'next/head'
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { useAuth } from '../context/context'
import { useRouter } from 'next/navigation'

const Page = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [data, setData] = useState({ name: '', email: '', role: '' })
    const [password, setPassword] = useState('')
    const { register, loading, error, setError } = useAuth()
    const [success, setSuccess] = useState('')
    const router = useRouter()

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await register(data.name, data.email, password, data.role)
        if (res?.message) {
            setSuccess(res.message)
            setData({ name: '', email: '', role: '' })
            setPassword('')
        }

        setTimeout(() => {
            setSuccess('')
            setError(null)
        }, 2000)
    }

    return (
        <>
            <Head>
                <title>Sign Up</title>
            </Head>
            <div className="min-h-screen flex">
                <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center p-12">
                    <div className="text-white text-center">
                        <h1 className="text-4xl font-bold mb-4">Join Our Community</h1>
                        <p className="text-lg">Start your journey with us today.</p>
                    </div>
                </div>

                <div className="flex w-full md:w-1/2 justify-center items-center p-8">
                    <div className="w-full max-w-md">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Create an Account</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    name='name'
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    placeholder="Jane Doe"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name='email'
                                    value={data.email}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                    Role
                                </label>
                                <select
                                    id="role"
                                    name='role'
                                    value={data.role}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                >
                                    <option default disabled value="">--Select Role--</option>
                                    <option value="admin">Admin</option>
                                    <option value="editor">Editor</option>
                                    <option value="viewer">Viewer</option>
                                </select>
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
                            {success && <p className="text-green-600 text-sm">{success}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-300"
                            >
                                {loading ? 'Signing Up...' : 'Sign Up'}
                            </button>

                            <p className="text-sm text-center text-gray-600 mt-4">
                                Already have an account?{' '}
                                <a href="/login" className="text-indigo-500 hover:underline">
                                    Log In
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Page
