import { param, body } from 'express-validator'
import Mongoose from 'mongoose'
import Sample from '../models/Sample.js'

export const getSingleSampleValidators = [
  param('id').custom(async id => {
    if (!Mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid id')
    }

    const sample = await Sample.findById(id)

    if (!sample) {
      throw new Error('Cannot find a sample')
    }
  }),
]

export const uploadSampleValidators = [
  body('title').trim().isEmpty().withMessage('Title cannot be empty').isString().withMessage('Title must be a string'),
  body('price').isEmpty().withMessage('Price cannot be empty').not().isDecimal().withMessage('Price must be a number'),
  body('bpm').trim().isEmpty().withMessage('Bpm cannot be empty').isString().withMessage('Bpm must be a string'),
  body('key').trim().isEmpty().withMessage('Key cannot be empty').isString().withMessage('Key must be a string'),
]

export const deleteSampleValidators = [
  body('sampleId').custom(async id => {
    if (!Mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid id')
    }

    const sample = await Sample.findById(id)

    if (!sample) {
      throw new Error('Cannot find a sample')
    }
  }),
]
