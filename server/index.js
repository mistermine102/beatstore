//dotenv files config
import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import errorHandling from './middleware/errorHandling.js'
import invalidRoute from './invalidRoute.js'
import authRoutes from './routes/auth.js'
import trackRoutes from './routes/tracks.js'
import profileRoutes from './routes/profile.js'
import adminRoutes from './routes/admin.js'
import reportRoutes from './routes/reports.js'
import cookieParser from 'cookie-parser'

import { verifyToken } from './middleware/auth.js'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }))

app.use(verifyToken)

//routes
app.use('/auth', authRoutes)
app.use('/tracks', trackRoutes)
app.use('/profile', profileRoutes)
app.use('/admin', adminRoutes)
app.use('/reports', reportRoutes)

//404 invalid route
app.all('*', invalidRoute)

//generic error handling middleware
app.use(errorHandling)

//connect to the database
app.listen(3000, () => {
  mongoose
    .connect(process.env.DB_URI)
    .then(() => console.log('Connected to db'))
    .catch(err => console.log("Can't connect to database", err))
  console.log('Listening on port 3000')
})
