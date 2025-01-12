import mongoose from 'mongoose'
import AppError from '../classes/AppError.js'

export default field => {
  return (req, res, next) => {
    const id = req.params[field]

    if (!mongoose.isValidObjectId(id)) throw new AppError('INVALID_ID', 400)
    next()
  }
}
