const express = require('express')
const router = express.Router()
const userController = require('../controllers/authController')
const { } = require('../controllers/authController')
const { protect, authorize } = require('../middleware/authMiddleware')
const User = require('../models/User')
const Log = require('../models/Log')

router.get('/users', protect, async (req, res) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const query = {
        isDeleted: false,
        role: { $ne: 'admin' }
    }

    let usersQuery = User.find(query)

    if (!isNaN(page) && !isNaN(limit)) {
        const skip = (page - 1) * limit
        usersQuery = usersQuery.skip(skip).limit(limit)
    }

    const [users, total] = await Promise.all([
        usersQuery,
        User.countDocuments(query)
    ])

    const response = { users, total }

    if (!isNaN(page) && !isNaN(limit)) {
        response.page = page
        response.pages = Math.ceil(total / limit)
    }

    res.json(response)
})

router.patch('/users/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const allowedFields = ['name', 'email', 'role']
        const updateData = {}

        for (let field of allowedFields) {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field]
            }
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        )

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        await Log.create({ user: user._id, action: "User updated" })
        res.json(user)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// router.delete('/users/:id', protect, authorize('admin'), async (req, res) => {
//     await User.findByIdAndDelete(req.params.id)
//     res.json({ message: 'User deleted' })
// })

router.put('/:id', protect, authorize('admin'), userController.deleteUser)

router.get("/logs", protect, authorize("admin"), async (req, res) => {
    const logs = await Log.find().populate("user", "email").sort({ createdAt: -1 })
    res.json(logs)
})

router.get('/content', protect, authorize('admin', 'editor'), (req, res) => {
    res.json({ message: 'Editable content fetched' })
})

router.get('/readonly', protect, authorize('admin', 'editor', 'viewer'), (req, res) => {
    res.json({ message: 'Read-only content fetched' })
})

module.exports = router