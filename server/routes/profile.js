import express from 'express'
import tryCatch from '../utils/tryCatch.js'
import {
  getSingleProfile,
  toggleFollow,
  editProfile,
  uploadProfileImage,
  getProfiles,
  deleteProfile,
  addFeaturedProfile,
  deleteFeaturedProfile,
  getFeaturedProfiles,
} from '../controllers/profile.js'
import { hasRole, isAuthenticated } from '../middleware/auth.js'
import { profileImageUpload } from '../multer.js'
import validate from '../middleware/validate.js'
import isValidId from '../middleware/isValidId.js'
import { query, body } from 'express-validator'

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

const editProfileValidators = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username cannot be empty')
    .isLength({ min: 4, max: 25 })
    .withMessage('Username must be between 4 and 25 characters long')
    .isString()
    .withMessage('Username must be a string'),
  body('specification')
    .trim()
    .notEmpty()
    .withMessage('Specification is required')
    .isLength({ max: 50 })
    .withMessage('Specification must be less than 50 characters long')
    .isString()
    .withMessage('Specification must be a string'),
  body('socialLinks')
    .exists()
    .withMessage('Social links are required')
    .isArray()
    .withMessage('Social links must be an array')
    .custom(links => links.length <= 6)
    .withMessage('Maximum of 6 social links allowed'),
  body('socialLinks.*.platform')
    .if(body('socialLinks').exists())
    .isIn(['facebook', 'instagram', 'soundcloud', 'youtube', 'twitter', 'tiktok', 'other'])
    .withMessage('Invalid social media platform'),
  body('socialLinks.*.url')
    .if(body('socialLinks').exists())
    .isURL()
    .withMessage('Invalid URL format')
    .isLength({ max: 255 })
    .withMessage('URL is too long (maximum 255 characters)'),
]

//featured profiles
router.post('/featured', isAuthenticated, hasRole('admin'), tryCatch(addFeaturedProfile))

router.delete('/featured', isAuthenticated, hasRole('admin'), tryCatch(deleteFeaturedProfile))

router.get('/featured', tryCatch(getFeaturedProfiles))

//profiles
router.get('/:profileId', isValidId('profileId'), tryCatch(getSingleProfile))

router.get('/', getProfilesValidators, validate, tryCatch(getProfiles))

router.patch('/', isAuthenticated, editProfileValidators, validate, tryCatch(editProfile))

router.post('/image', isAuthenticated, profileImageUpload.single('image'), tryCatch(uploadProfileImage))

router.post('/:profileId/follow', isValidId('profileId'), isAuthenticated, tryCatch(toggleFollow))

router.delete('/', isAuthenticated, tryCatch(deleteProfile))

export default router
