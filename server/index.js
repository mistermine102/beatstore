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
import licenseRoutes from './routes/licenses.js'
import paymentRoutes from './routes/payments.js'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { globalLimiter } from './limiters.js'

import { verifyToken } from './middleware/auth.js'

const allowedOrigins = [
  'https://www.wavsmarket.com',    // Prod
  'https://wavsmarket.com',        // Prod (no www)
  'https://test.wavsmarket.com',   // Test Environment
  'http://localhost:5173',         // Local Vue/Vite
  'http://localhost:3000'          // Local Node (just in case)
];

const app = express()

// Webhook route with raw body BEFORE json middleware
app.use('/api/payments/stripe-events', express.raw({ type: 'application/json' }))

app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(helmet())
app.set('trust proxy', 1)
app.use(globalLimiter)

// For local development only
if (process.env.NODE_ENV !== 'production') {
  const startServer = async () => {
    try {
      await mongoose.connect(process.env.DB_URI)
      console.log('Connected to db')
      app.listen(3000, () => {
        console.log('Listening on port 3000')
      })
    } catch (err) {
      console.log("Can't connect to database", err)
    }
  }
  startServer()
}

// For production/Vercel
// Connect to MongoDB when the function is invoked
const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.DB_URI)
      console.log('Connected to MongoDB')
    } catch (error) {
      console.error('MongoDB connection error:', error)
    }
  }
}

// Middleware to connect to DB before processing requests
app.use(async (req, res, next) => {
  await connectDB()
  next()
})

app.use(verifyToken)

//routes
app.use('/api/auth', authRoutes)
app.use('/api/tracks', trackRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/licenses', licenseRoutes)
app.use('/api/payments', paymentRoutes)

//404 invalid route
app.all('*', invalidRoute)

//generic error handling middleware
app.use(errorHandling)

export default app
