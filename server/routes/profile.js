import express from 'express'
import tryCatch from '../utils/tryCatch.js'
import { getSingleProfile, toggleFollow, editProfile, uploadProfileImage, getProfiles } from '../controllers/profile.js'
import { isAuthenticated } from '../middleware/auth.js'
import { editProfileValidators } from '../validators/profile.js'
import { profileImageUpload } from '../multer.js'
import validate from '../middleware/validate.js'
import isValidId from '../middleware/isValidId.js'
import { query } from 'express-validator'

const router = express.Router()

const getProfilesValidators = [
  query('start')
    .optional() // Allow 'start' to be omitted
    .isInt({ min: 0 })
    .withMessage('start must be an integer greater than or equal to 0'),
  // Validate 'amount'
  query('amount')
    .optional() // Allow 'amount' to be omitted
    .isInt({ min: 0, max: 100 })
    .withMessage('amount must be an integer between 0 and 100'),
]

router.get('/:profileId', isValidId('profileId'), tryCatch(getSingleProfile))

router.get('/', getProfilesValidators, validate, tryCatch(getProfiles))

router.patch('/', isAuthenticated, editProfileValidators, validate, tryCatch(editProfile))

router.post('/image', isAuthenticated, profileImageUpload.single('image'), tryCatch(uploadProfileImage))

router.post('/:profileId/follow', isValidId('profileId'), isAuthenticated, tryCatch(toggleFollow))

export default router
