import AppError from '../classes/AppError.js'
import { validationResult } from 'express-validator'

export default (req, res, next) => {
  const result = validationResult(req)
  if (!result.isEmpty()) throw new AppError('Validation failed', 400, result.array())
  next()
}
