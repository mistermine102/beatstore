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
import beatsRoutes from './routes/beats.js'
import samplesRoutes from './routes/samples.js'
import drumkitsRoutes from './routes/drumkits.js'
import authRoutes from './routes/auth.js'
import toggleLikeRoutes from './routes/toggleLike.js'
import streamRoutes from './routes/streamTrack.js'
import profileRoutes from './routes/profile.js'

import { verifyToken } from './middleware/auth.js'

import { getSingleBeat } from './controllers/beats.js'
import { getSingleSample } from './controllers/samples.js'
import { getSingleDrumkit } from './controllers/drumkits.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use(verifyToken)

//routes
app.use('/beats', beatsRoutes)
app.use('/samples', samplesRoutes)
app.use('/drumkits', drumkitsRoutes)
app.use(authRoutes)
app.use(toggleLikeRoutes)
app.use(streamRoutes)
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
