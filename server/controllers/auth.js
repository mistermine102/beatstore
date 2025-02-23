import dotenv from 'dotenv'
dotenv.config()

import Bcrypt from 'bcryptjs'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import AppError from '../classes/AppError.js'
import { UAParser } from 'ua-parser-js'

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
  const existingUser = await User.findOne({ email })

  if (existingUser) throw new AppError('EMAIL_NOT_AVAILABLE', 400)

  const hashedPassword = await Bcrypt.hash(password, 12)
  const newUser = new User({ username, email, password: hashedPassword })
  await newUser.save()

  res.json({ message: 'User registered successfully' })
}

export const login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!user || !(await Bcrypt.compare(password, user.password))) {
    throw new AppError('Invalid email or password', 401)
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
