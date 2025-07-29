const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv').config()
const authRoutes = require('./routes/authRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const { errorHandler } = require('./middleware/errorMiddleware')


const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('DB is connected')
}).catch((e) => {
    console.log(`${e}`)
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/api', (req, res) => {
    res.send('APIs are working!')
})
app.use('/api/auth', authRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`)
})