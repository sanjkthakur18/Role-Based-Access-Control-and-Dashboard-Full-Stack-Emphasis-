"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiTrash2, FiEdit2, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../context/context'

export default function UsersPage() {
    const { users, getUsers, deleteUser, updateUser, logout, error, loading, token, isAuthReady, user } = useAuth()

    const router = useRouter()
    const [editId, setEditId] = useState(null)
    const [editedName, setEditedName] = useState('')
    const [editedEmail, setEditedEmail] = useState('')
    const [editedRole, setEditedRole] = useState('')
    const [popupData, setPopupData] = useState({ message: '', type: '' })
    const [showPopup, setShowPopup] = useState(false)

    useEffect(() => {
        if (!isAuthReady) return
        if (token) {
            getUsers()
        } else {
            router.push('/login')
        }
    }, [token, isAuthReady])

    const handleDelete = async (id) => {
        const success = await deleteUser(id)
        if (success) {
            showAnimatedPopup('User deleted successfully!', 'delete')
        } else {
            showAnimatedPopup('You are not authorized to delete this user.', 'delete')
        }
    }

    const handleEdit = (user) => {
        setEditId(user._id)
        setEditedName(user.name)
        setEditedEmail(user.email)
        setEditedRole(user.role)
    }

    const handleCancelEdit = () => {
        setEditId(null)
        setEditedName('')
        setEditedEmail('')
        setEditedRole('')
    }

    const handleSaveEdit = async (id) => {
        await updateUser(id, { name: editedName, email: editedEmail, role: editedRole })
        if (success) {
            showAnimatedPopup('User updated successfully!', 'update')
            handleCancelEdit()
        } else {
            showAnimatedPopup('You are not authorized to update this user.', 'update')
        }
    }

    const handleLogout = () => {
        logout()
        router.push('/login')
    }

    const showAnimatedPopup = (message, type) => {
        setPopupData({ message, type })
        setShowPopup(true)
        setTimeout(() => {
            setShowPopup(false)
        }, 2000)
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-8">
            {showPopup && (
                <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    ${popupData.type === 'delete' ? 'bg-red-600/80' : 'bg-green-600/80'} 
                    text-white px-6 py-4 rounded-xl text-lg font-medium shadow-lg 
                    transition-opacity duration-500 ease-in-out opacity-100 animate-fadeOut flex items-center gap-3 z-50`}>
                    <span className="text-2xl">
                        {popupData.type === 'update' ? '✅' : '🗑️'}
                    </span>
                    <span>{popupData.message}</span>
                </div>
            )}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-extrabold text-indigo-800">User List</h1>
                <div className='flex items-center gap-4'>
                    <p>Logged in as: {user?.role}</p>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                    >
                        <FiLogOut />
                        Logout
                    </button>
                </div>
            </div>

            {error && <p className="text-red-600 mb-4 font-semibold">{error}</p>}

            <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-xl overflow-hidden">
                <table className="min-w-full table-auto text-sm">
                    <thead className="bg-indigo-600/90 text-white text-left">
                        <tr>
                            <th className="py-3 px-6 font-semibold">Name</th>
                            <th className="py-3 px-6 font-semibold">Role</th>
                            <th className="py-3 px-6 font-semibold">Email</th>
                            <th className="py-3 px-6 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800">
                        {users.map((user) => (
                            <tr
                                key={user._id}
                                className="border-b border-gray-300 hover:bg-white/40 transition"
                            >
                                <td className="py-4 px-6">
                                    {editId === user._id ? (
                                        <input
                                            className="border px-3 py-1 rounded w-full bg-white/80 backdrop-blur-sm outline-indigo-400"
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                        />
                                    ) : (
                                        user.name
                                    )}
                                </td>
                                <td className="py-4 px-6">
                                    {editId === user._id ? (
                                        <select
                                            value={editedRole}
                                            onChange={(e) => setEditedRole(e.target.value)}
                                            className="border px-3 py-1 rounded w-full bg-white/80 backdrop-blur-sm outline-indigo-400"
                                        >
                                            <option value="user">Viewer</option>
                                            <option value="admin">Admin</option>
                                            <option value="manager">Editor</option>
                                        </select>
                                    ) : (
                                        user.role
                                    )}
                                </td>
                                <td className="py-4 px-6">
                                    {editId === user._id ? (
                                        <input
                                            className="border px-3 py-1 rounded w-full bg-white/80 backdrop-blur-sm outline-indigo-400"
                                            value={editedEmail}
                                            onChange={(e) => setEditedEmail(e.target.value)}
                                        />
                                    ) : (
                                        user.email
                                    )}
                                </td>
                                <td className="py-4 px-6 space-x-3">
                                    {editId === user._id ? (
                                        <>
                                            <button
                                                onClick={() => handleSaveEdit(user._id)}
                                                className="text-green-600 hover:text-green-800 transition cursor-pointer"
                                            >
                                                ✅
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="text-gray-600 hover:text-gray-800 transition cursor-pointer"
                                            >
                                                ❌
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="text-blue-600 hover:text-blue-800 transition cursor-pointer"
                                                title="Edit"
                                            >
                                                <FiEdit2 className="inline h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="text-red-600 hover:text-red-800 transition cursor-pointer"
                                                title="Delete"
                                            >
                                                <FiTrash2 className="inline h-5 w-5" />
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && !loading && (
                            <tr>
                                <td colSpan={3} className="text-center py-6 text-gray-500 italic">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
