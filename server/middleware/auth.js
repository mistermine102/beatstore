import jwt from 'jsonwebtoken'
import AppError from '../classes/AppError.js'
import User from '../models/User.js'

export const verifyToken = async (req, res, next) => {
  console.log('VerifyToken Middleware is RUNNING for path:', req.path);

  // Skip token verification for refresh endpoint
  if (req.path === '/auth/refresh') {
    return next()
  }

  const authHeader = req.headers['authorization']

  if (!authHeader) {
    req.isAuthenticated = false
    return next()
  }

  const accessToken = authHeader.split(' ')[1]

  if (!accessToken || accessToken == 'null') {
    req.isAuthenticated = false
    return next()
  }

  jwt.verify(accessToken, process.env.JWT_SECRET, async (err, payload) => {
    try {
      if (err) {
        req.isAuthenticated = false
        //check if token has expired
        if (err.name === 'TokenExpiredError') {
          req.isAuthenticated = false
          throw new AppError('ACCESS_TOKEN_EXPIRED', 401)
        }
        //other cause of failed token validation
        throw new AppError('TOKEN_VALIDATION_FAILED', 401)
      }

      const user = await User.findById(payload.id)
      if (!user) throw new AppError('TOKEN_VALIDATION_FAILED')

      req.userId = user._id
      req.user = user
      req.isAuthenticated = true

      return next()
    } catch (error) {
      next(error)
    }
  })
}

export const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated) {
    throw new AppError('Not authenticated', 401)
  } else {
    next()
  }
}

export const hasRole = role => (req, res, next) => {
  if (!req.user.roles.includes(role)) throw new AppError(`Missing role: ${role}`, 401)
  next()
}
