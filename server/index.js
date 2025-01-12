//dotenv files config
import dotenv from 'dotenv'
dotenv.config()

//packages
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

//files imports
import errorHandling from './middleware/errorHandling.js'
import invalidRoute from './invalidRoute.js'

//routes imports
import authRoutes from './routes/auth.js'
import trackRoutes from './routes/tracks.js'
import profileRoutes from './routes/profile.js'

import { verifyToken } from './middleware/auth.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use(verifyToken)

//routes
app.use(authRoutes)
app.use('/tracks', trackRoutes)
app.use('/profile', profileRoutes)

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
