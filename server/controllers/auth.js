import dotenv from 'dotenv'
dotenv.config()

import Bcrypt from 'bcryptjs'
import User, { UnverifiedUser } from '../models/User.js'
import jwt from 'jsonwebtoken'
import AppError from '../classes/AppError.js'
import { UAParser } from 'ua-parser-js'
import { sendVerifyEmail, sendResetPasswordEmail } from '../emails/emails.js'

const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION
const JWT_SECRET = process.env.JWT_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

const sanitizeUser = user => {
  const { _id, email, username, createdAt, roles } = user
  return { _id, email, username, createdAt, roles }
}

const generateAccessToken = user => {
  return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION })
}

const generateRefreshToken = (user, req) => {
  const parser = new UAParser()
  const userAgent = req.headers['user-agent'] || ''
  const { device, os, browser } = parser.setUA(userAgent).getResult()

  const meta = {
    ip: req.headers['x-forwarded-for']?.split(',')[0] || req.ip,
    device,
    os,
    browser,
  }

  return jwt.sign({ id: user._id, meta }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION })
}

export const register = async (req, res) => {
  const { username, email, password } = req.body

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  })

  if (existingUser) {
    if (existingUser.email === email) {
      throw new AppError('EMAIL_NOT_AVAILABLE', 400)
    } else {
      throw new AppError('USERNAME_NOT_AVAILABLE', 400)
    }
  }

  //check if user is in the unverified users collection
  const unverifiedUser = await UnverifiedUser.findOne({ email })
  if (unverifiedUser) throw new AppError('USER_NOT_VERIFIED', 400)

  //create new unverified user
  const hashedPassword = await Bcrypt.hash(password, 12)
  const newUser = new UnverifiedUser({ username, email, password: hashedPassword })
  await newUser.save()

  //send verify email
  await sendVerifyEmail(email)

  res.json({ message: 'User registered successfully' })
}

export const login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  // Check if user exists in UnverifiedUsers collection
  const unverifiedUser = await UnverifiedUser.findOne({ email })
  if (unverifiedUser) {
    throw new AppError('USER_NOT_VERIFIED', 400)
  }

  if (!user || !(await Bcrypt.compare(password, user.password))) {
    throw new AppError('INVALID_CREDENTIALS', 401)
  }

  //generate tokens
  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user, req)

  // Save refresh token in DB
  user.refreshTokens.push(refreshToken)
  await user.save()

  // Store refresh token in HTTP-Only Cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })

  res.json({ accessToken, user: sanitizeUser(user) })
}

export const refreshToken = async (req, res) => {
  console.log('Attempting to refresh token...')
  const { refreshToken } = req.cookies
  if (!refreshToken) throw new AppError('Refresh token not provided', 403)

  //find a user with this refreshToken
  const user = await User.findOne({ refreshTokens: refreshToken })
  if (!user) {
    res.clearCookie('refreshToken')
    throw new AppError('INVALID_REFRESH_TOKEN', 403)
  }

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, err => {
    if (err) {
      res.clearCookie('refreshToken')
      throw new AppError('INVALID_REFRESH_TOKEN', 403)
    }

    const newAccessToken = generateAccessToken(user)
    res.json({ accessToken: newAccessToken })
  })
}

export const getUser = async (req, res) => {
  const { refreshToken } = req.cookies
  if (!refreshToken) return res.json({ message: 'REFRESH_TOKEN_NOT_PROVIDED' })

  const user = await User.findOne({ refreshTokens: refreshToken })

  if (!user) {
    res.clearCookie('refreshToken')
    return res.json({ message: 'INVALID_REFRESH_TOKEN' })
  }

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, err => {
    if (err) {
      res.clearCookie('refreshToken')
      return res.json({ message: 'INVALID_REFRESH_TOKEN' })
    }
    const newAccessToken = generateAccessToken(user)
    res.json({ accessToken: newAccessToken, user: sanitizeUser(user) })
  })
}

export const logout = async (req, res) => {
  const { refreshToken } = req.cookies
  if (!refreshToken) return res.sendStatus(204) // No Content

  const user = await User.findOne({ refreshTokens: refreshToken })

  if (user) {
    user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken)
    await user.save()
  }

  res.clearCookie('refreshToken')
  res.json({ message: 'Logged out successfully' })
}

export const verifyUser = async (req, res) => {
  //extract and verify token
  const { token } = req.params

  jwt.verify(token, process.env.JWT_EMAIL_SECRET, async (err, payload) => {
    //if token expired return a response
    if (err && err.name === 'TokenExpiredError') return res.redirect('http://localhost:5173/verify-user/link-expired')

    const { email } = payload

    //find unverified user
    const unverifiedUser = await UnverifiedUser.findOne({ email })
    if (!unverifiedUser) throw new AppError('UNVERIFIED_USER_NOT_FOUND')

    //create new verified user (just a user)
    const newUser = new User({ ...unverifiedUser._doc, verifiedAt: Date.now() })

    //save new user and delete unverified user
    await newUser.save()
    await unverifiedUser.deleteOne()

    res.redirect('http://localhost:5173/verify-user/success')
  })
}

export const resendVerification = async (req, res) => {
  const { email } = req.body

  // Check if user exists in UnverifiedUsers collection
  const unverifiedUser = await UnverifiedUser.findOne({ email })
  if (!unverifiedUser) throw new AppError('USER_NOT_FOUND', 404)

  // Send new verification email
  await sendVerifyEmail(email)

  res.json({ message: 'Verification email sent' })
}

export const sendResetPasswordLink = async (req, res) => {
  const { email } = req.body

  // Check if user exists in User collection
  const user = await User.findOne({ email })

  // Always send a success response even if user doesn't exist
  // This prevents email enumeration attacks
  if (!user) return res.json({ message: 'Success' })

  // Generate JWT token for password reset
  const token = jwt.sign(
    { email, type: 'password-reset' },
    process.env.JWT_PASSWORD_RESET_SECRET,
    { expiresIn: '1h' } // Token expires in 1 hour
  )

  // Create reset link with token
  const resetLink = `http://localhost:5173/reset-password/${token}`

  // Send email with reset link
  await sendResetPasswordEmail(email, resetLink)

  // Return success response
  res.json({ message: 'Success' })
}

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body

  // Verify the JWT token
  const decoded = jwt.verify(token, process.env.JWT_PASSWORD_RESET_SECRET)

  // Check if token is for password reset
  if (decoded.type !== 'password-reset') throw new AppError('INVALID_TOKEN', 400)

  // Get user email from decoded token
  const { email } = decoded

  // Find user by email
  const user = await User.findOne({ email })
  if (!user) throw new AppError('USER_NOT_FOUND', 404)

  // Hash the new password
  const hashedPassword = await Bcrypt.hash(newPassword, 10)

  // Update user's password
  user.password = hashedPassword

  // Save updated user
  await user.save()

  // Return success response
  return res.status(200).json({ message: 'PASSWORD_RESET_SUCCESS' })
}
