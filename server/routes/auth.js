import express from 'express'
import { body } from 'express-validator'
import { register, login, refreshToken, logout, getUser } from '../controllers/auth.js'
import tryCatch from '../utils/tryCatch.js'
import validate from '../middleware/validate.js'

const router = express.Router()

const registerValidators = [
  body('username').isLength({ min: 4 }).withMessage('Username must be at least 4 characters long'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
]

router.post('/register', registerValidators, validate, tryCatch(register))
router.post('/login', validate, tryCatch(login))
router.post('/refresh', tryCatch(refreshToken))
router.post('/get-user', tryCatch(getUser))
router.post('/logout', tryCatch(logout))

export default router
