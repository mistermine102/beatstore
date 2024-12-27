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
  body('title').trim().isEmpty().withMessage('Title cannot be empty').isString().withMessage('Title must be a string'),
  body('price').isEmpty().withMessage('Price cannot be empty').not().isDecimal().withMessage('Price must be a number'),
  body('bpm').trim().isEmpty().withMessage('Bpm cannot be empty').isString().withMessage('Bpm must be a string'),
  body('key').trim().isEmpty().withMessage('Key cannot be empty').isString().withMessage('Key must be a string'),
  body('genre').trim().isEmpty().withMessage('Genre cannot be empty').isString().withMessage('Genre must be a string'),
]

export const deleteBeatValidators = [
  body('beatId').custom(async id => {
    if (!Mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid id')
    }

    const beat = await Beat.findById(id)

    if (!beat) {
      throw new Error('Cannot find a beat')
    }
  }),
]
