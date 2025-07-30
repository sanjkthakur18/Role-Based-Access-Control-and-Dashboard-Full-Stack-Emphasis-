const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Log = require('../models/Log')

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' })
        }

        if (role === 'admin') {
            const existingAdmin = await User.findOne({ role: 'admin' })
            if (existingAdmin) {
                return res.status(400).json({ message: 'An admin already exists' })
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ name, email, password: hashedPassword, role })

        await Log.create({ user: user._id, action: "Registered new user" })
        res.status(201).json({ message: 'User created', user })
    } catch (err) {
        next(err)
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1d',
        })

        await Log.create({ user: user._id, action: "User logged in" })
        res.json({ token: token, role: user.role })
    } catch (err) {
        next(err)
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params

        const user = await User.findById(id)
        if (!user || user.isDeleted) {
            return res.status(404).json({ message: 'User not found or already deleted' })
        }

        user.isDeleted = true
        await user.save()

        await Log.create({ user: user._id, action: "User deleted" })
        res.status(200).json({ message: 'User soft deleted successfully' })
    } catch (error) {
        console.error('Delete user error:', error.message)
        res.status(500).json({ message: 'Server error while deleting user' })
    }
}
