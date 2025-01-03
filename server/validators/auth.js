import { body } from 'express-validator'

export const loginValidators = [
  // body('email').notEmpty().isLength({ min: 1 }).withMessage('Email cannot be empty').isEmail().withMessage('Email must be valid'),
  // body('password').notEmpty().isLength({ min: 1 }).withMessage('Password cannot be empty').isString().withMessage('Password must be a string'),
]

export const registerValidators = [
  body('username').isLength({ min: 4 }).withMessage('Username must be at least 4 characters long'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
]
