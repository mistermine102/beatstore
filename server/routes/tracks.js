import express from 'express'
import { body, query, param } from 'express-validator'
import tryCatch from '../utils/tryCatch.js'
import { isAuthenticated } from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import { trackUpload, trackImageUpload } from '../multer.js'
import {
  getTracks,
  uploadTrack,
  streamTrack,
  toggleTrackLike,
  uploadTrackImage,
  getSingleTrack,
  deleteTrack,
  getPopularTracks,
} from '../controllers/tracks.js'
import isValidId from '../middleware/isValidId.js'
import { addComment, deleteComment, toggleCommentLike } from '../controllers/trackComments.js'
import { KEYS, MOODS, GENRES, INSTRUMENTS } from '../constants.js'
import { uploadFilelimiter } from '../limiters.js'

const router = express.Router()

const getTracksValidators = [
  param('type')
    .exists()
    .withMessage('type is required')
    .isIn(['beat', 'sample', 'drumkit', 'all', 'loop'])
    .withMessage('type must be one of: beat, sample, drumkit, all')
    .escape(),
  query('start')
    .optional() // Allow 'start' to be omitted
    .isInt({ min: 0 })
    .withMessage('start must be an integer greater than or equal to 0')
    .escape(),
  // Validate 'amount'
  query('amount')
    .optional() // Allow 'amount' to be omitted
    .isInt({ min: 0, max: 100 })
    .withMessage('amount must be an integer between 0 and 100')
    .escape(),
  query('authorId')
    .optional() // Allow 'AuthorId' to be omitted
    .isMongoId()
    .withMessage('AuthorId must be a valid MongoDB ObjectId')
    .escape(),
]

const uploadTrackValidators = [
  body('type')
    .exists()
    .withMessage('Type cannot be empty')
    .trim()
    .isString()
    .withMessage('Type must be a string')
    .isIn(['beat', 'sample', 'drumkit', 'loop']),
  body('title')
    .exists()
    .withMessage('Title cannot be empty')
    .trim()
    .isString()
    .withMessage('Title must be a string')
    .isLength({ min: 4, max: 100 })
    .withMessage('Title must be between 4 and 100 characters')
    .escape(),
  body('bpm')
    .optional()
    .custom(value => {
      // Accept empty string
      if (value === '') {
        return true
      }

      // Convert to number and check if it's valid
      const bpm = Number(value)

      // Check if it's a valid number (not NaN)
      if (isNaN(bpm)) {
        throw new Error('BPM must be a valid number')
      }

      // Check if it's a whole number
      if (!Number.isInteger(bpm)) {
        throw new Error('BPM must be a whole number')
      }

      // Check if it's within the valid range
      if (bpm < 0 || bpm > 999) {
        throw new Error('BPM must be between 0 and 999')
      }

      return true
    })
    .escape(),
  body('key')
    .optional()
    .isIn([...KEYS, ''])
    .withMessage('Key must be one of the valid keys'),
  body('mood')
    .optional()
    .isIn([...MOODS, ''])
    .withMessage('Mood must be one of the valid moods'),
  body('genre')
    .optional()
    .isIn([...GENRES, ''])
    .withMessage('Genre must be one of the valid genres'),
  body('instruments')
    .optional()
    .isArray()
    .withMessage('Instruments must be an array')
    .custom(instruments => {
      // Check if all instruments are in the allowed set
      const validInstruments = instruments.every(instrument => INSTRUMENTS.includes(instrument))
      if (!validInstruments) {
        throw new Error('All instruments must be from the valid instrument list')
      }

      // Check for duplicates
      const uniqueInstruments = new Set(instruments)
      if (uniqueInstruments.size !== instruments.length) {
        throw new Error('Duplicate instruments are not allowed')
      }

      return true
    }),
  body('pricingType')
    .exists()
    .withMessage('pricingType is required')
    .isIn(['free', 'paid'])
    .withMessage('pricingType must be either "free" or "paid"'),
  body('sellThrough')
    .optional()
    .isIn(['platform', 'external'])
    .withMessage('sellThrough must be either "platform" or "external"')
    .custom((value, { req }) => {
      // If pricingType is paid, sellThrough is required
      if (req.body.pricingType === 'paid' && !value) {
        throw new Error('sellThrough is required when pricingType is paid')
      }
      return true
    }),
  body('tiers')
    .optional()
    .isArray()
    .withMessage('tiers must be an array')
    .custom((tiers, { req }) => {
      // If pricingType is free, tiers should not be provided
      if (req.body.pricingType === 'free' && tiers && tiers.length > 0) {
        throw new Error('tiers are not allowed when pricingType is free')
      }

      // If sellThrough is platform, tiers are required
      if (req.body.sellThrough === 'platform' && (!tiers || tiers.length === 0)) {
        throw new Error('tiers are required when selling through platform')
      }

      // Validate each tier
      for (const tier of tiers || []) {
        const price = Number(tier.price)

        // Price must be a valid non-negative number
        if (isNaN(price) || price < 0 || price > 1000000) {
          throw new Error('Each tier price must be a valid number between 0 and 1,000,000')
        }

        if (!tier.licenseId || typeof tier.licenseId !== 'string') {
          throw new Error('Each tier must include a licenseId (string)')
        }
      }

      // If selling through platform, ensure at least one tier has price > 0
      if (req.body.sellThrough === 'platform' && tiers && tiers.length > 0) {
        const hasPayingTier = tiers.some(tier => Number(tier.price) > 0)
        if (!hasPayingTier) {
          throw new Error('At least one tier must have a price greater than zero when selling through platform')
        }
      }

      return true
    }),
  body('freeDownloadPolicy')
    .exists()
    .isIn(['unavailable', 'direct'])
    .custom((value, { req }) => {
      // Free tracks must allow downloads
      if (req.body.pricingType === 'free' && value === 'unavailable') {
        throw new Error('Free tracks must have freeDownloadPolicy set to "direct"')
      }
      return true
    }),
]

const addCommentValidators = [
  body('content')
    .exists()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content must be a string')
    .trim()
    .withMessage('Content cannot have leading or trailing spaces')
    .notEmpty()
    .withMessage('Content cannot be empty')
    .isLength({ min: 1, max: 500 })
    .withMessage('Content must be between 1 and 500 characters')
    .escape(),
]

router.get('/popular', tryCatch(getPopularTracks))

router.get('/:type', getTracksValidators, validate, tryCatch(getTracks))

router.get('/single/:trackId', isValidId('trackId'), tryCatch(getSingleTrack))

router.delete('/:trackId', isAuthenticated, isValidId('trackId'), tryCatch(deleteTrack))

router.post('/', isAuthenticated, uploadFilelimiter, trackUpload.single('audio'), uploadTrackValidators, validate, tryCatch(uploadTrack))

router.post('/:trackId/image', uploadFilelimiter, isAuthenticated, isValidId('trackId'), trackImageUpload.single('image'), tryCatch(uploadTrackImage))

router.post('/:trackId/like', isAuthenticated, isValidId('trackId'), tryCatch(toggleTrackLike))

router.post('/:trackId/stream', isValidId('trackId'), tryCatch(streamTrack))

router.post('/:trackId/comment', isAuthenticated, isValidId('trackId'), addCommentValidators, validate, tryCatch(addComment))

router.delete('/:trackId/comment/:commentId', isAuthenticated, isValidId('trackId'), isValidId('commentId'), tryCatch(deleteComment))

router.patch('/:trackId/comment/:commentId', isAuthenticated, isValidId('trackId'), isValidId('commentId'), tryCatch(toggleCommentLike))

export default router
