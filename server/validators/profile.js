import { body } from 'express-validator'

export const editProfileValidators = [
  body('username').trim().notEmpty().isLength({ min: 1 }).withMessage('Username cannot be empty').isString().withMessage('Username must be a string'),
  body('specification')
    .trim()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage('Specification cannot be empty')
    .isString()
    .withMessage('Specification must be a string'),
]
