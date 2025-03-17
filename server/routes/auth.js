import express from 'express'
import { body } from 'express-validator'
import {
  register,
  login,
  refreshToken,
  logout,
  getUser,
  verifyUser,
  resendVerification,
  sendResetPasswordLink,
  resetPassword,
} from '../controllers/auth.js'
import tryCatch from '../utils/tryCatch.js'
import validate from '../middleware/validate.js'

const router = express.Router()

const registerValidators = [
  body('username').isLength({ min: 4, max: 25 }).withMessage('Username must be between 4 and 25 characters long'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
]
const changePasswordValidators = [body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')]

router.post('/signup', registerValidators, validate, tryCatch(register))
router.post('/signin', tryCatch(login))
router.post('/refresh', tryCatch(refreshToken))
router.post('/get-user', tryCatch(getUser))
router.post('/logout', tryCatch(logout))
router.get('/verify/:token', tryCatch(verifyUser))
router.post('/resend-verification', tryCatch(resendVerification))
router.post('/reset-password', tryCatch(sendResetPasswordLink))
router.patch('/reset-password', changePasswordValidators, validate, tryCatch(resetPassword))

export default router
