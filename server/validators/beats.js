import { param, body } from 'express-validator'
import Mongoose from 'mongoose'
import Beat from '../models/Beat.js'

export const getSingleBeatValidators = [
  param('id').custom(async id => {
    if (!Mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid id')
    }

    const beat = await Beat.findById(id)

    if (!beat) {
      throw new Error('Cannot find a beat')
    }
  }),
]

export const uploadBeatValidators = [
  body('title').trim().notEmpty().withMessage('Title cannot be empty').isString().withMessage('Title must be a string'),
]
