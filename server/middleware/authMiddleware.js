const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.protect = async (req, res, next) => {
    let token

    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

            if (!decoded?.id) {
                return res.status(401).json({ message: 'Invalid token payload' })
            }

            const user = await User.findById(decoded.id)

            if (!user) {
                return res.status(401).json({ message: 'User no longer exists' })
            }

            req.user = user
            next()
        } catch (error) {
            console.log('AuthMiddleware Error:', error)
            return res.status(401).json({ message: 'Not authorized or token expired. Please log in again.' })
        }
    } else {
        return res.status(401).json({ message: 'No token attached to headers' })
    }
}


exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' })
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Access is denied' })
        }

        next()
    }
}
