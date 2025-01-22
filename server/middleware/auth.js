import jwt from 'jsonwebtoken'
import AppError from '../classes/AppError.js'
import mongoose from 'mongoose'
import User from '../models/User.js'

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']

  if (!authHeader) {
    req.isAuthenticated = false
    return next()
  }

  const token = authHeader.split(' ')[1]

  if (!token || token == 'null') {
    req.isAuthenticated = false
    return next()
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(payload.id)
    if(!user) throw new AppError("AUTH_FAILED")

    req.userId = mongoose.Types.ObjectId.createFromHexString(payload.id)
    req.isAuthenticated = true
    return next()
  } catch (e) {
    console.log('Token verification failed')

    if (e instanceof jwt.TokenExpiredError) {
      return res.json({ message: 'TokenExpired' })
    }

    const error = new AppError("AUTH_FAILED", 400)
    req.isAuthenticated = false
    return next(error)
  }
}

export const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated) {
    throw new AppError('Not authenticated', 401)
  } else {
    next()
  }
}
