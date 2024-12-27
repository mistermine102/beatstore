import Drumkit from '../models/Drumkit.js'
import { param, body } from 'express-validator'

export const getSingleDrumkitValidators = [
  param('id').custom(async id => {
    if (!Mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid id')
    }

    const drumkit = await Drumkit.findById(id)

    if (!drumkit) {
      throw new Error('Cannot find a drumkit')
    }
  }),
]

export const uploadDrumkitValidators = [
  body('drumkit').not().isObject().withMessage('Drumkit cannot be empty and must be an object'),
  body('drumkit.title').isEmpty().withMessage('Title cannot be empty').not().isString().withMessage('Title must be a string'),
  body('drumkit.price').isEmpty().withMessage('Price cannot be empty').not().isDecimal().withMessage('Price must be a number'),
  body('drumkit.directories.*.title')
    .isEmpty()
    .withMessage('Directory title cannot be empty')
    .isString()
    .withMessage('Directory title must be a string'),
  body('drumkit.directories.*.drums').isArray().withMessage('Directory must contain drums array'),
  body('drumkit.directories.*.drums.*.title')
    .isEmpty()
    .withMessage('Drum title cannot be empty')
    .isString()
    .withMessage('Drum title must be a string'),
  body('drumkit.directories.*.drums.*.type')
    .isEmpty()
    .withMessage('Drum type cannot be empty')
    .isString()
    .withMessage('Drum type must be a string'),
]
