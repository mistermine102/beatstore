import { body } from 'express-validator'
import User from '../models/User.js'

export const loginValidators = [
  body('email').notEmpty().isLength({ min: 1 }).withMessage('Email cannot be empty').isEmail().withMessage('Email must be valid'),
  body('password').notEmpty().isLength({ min: 1 }).withMessage('Password cannot be empty').isString().withMessage('Password must be a string'),
]

export const registerValidators = [
  body('username').isLength({ min: 4 }).withMessage('Username must be at least 4 characters long'),
  body('email')
    .isEmail()
    .withMessage('Invalid email')
    .custom(async email => {
      //check if email is not taken
      const existingUser = await User.findOne({ email })

      if (existingUser) {
        throw new Error('User with that email already exists')
      }
    }),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
]
