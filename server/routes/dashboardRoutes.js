const express = require('express')
const router = express.Router()
const userController = require('../controllers/authController')
const { } = require('../controllers/authController')
const { protect, authorize } = require('../middleware/authMiddleware')
const User = require('../models/User')
const Log = require('../models/Log')

router.get('/users', protect, authorize('admin'), async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const query = {
        isDeleted: false,
        role: { $ne: 'admin' }
    }

    const users = await User.find(query).skip(skip).limit(limit)
    const total = await User.countDocuments()

    res.json({ users, total, page, pages: Math.ceil(total / limit) })
})

router.patch('/users/:id/role', protect, authorize('admin'), async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true })
    await Log.create({ user: user._id, action: "User updated" });
    res.json(user)
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