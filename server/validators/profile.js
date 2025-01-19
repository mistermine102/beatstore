import { body } from 'express-validator'

export const editProfileValidators = [
  body('username').trim().notEmpty().isLength({ min: 4 }).withMessage('Username cannot be empty').isString().withMessage('Username must be a string'),
]
