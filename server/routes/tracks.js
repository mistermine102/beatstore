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

const router = express.Router()

const getTracksValidators = [
  param('type')
    .exists()
    .withMessage('type is required')
    .isIn(['beat', 'sample', 'drumkit', 'all', 'loop'])
    .withMessage('type must be one of: beat, sample, drumkit, all'),
  query('start')
    .optional() // Allow 'start' to be omitted
    .isInt({ min: 0 })
    .withMessage('start must be an integer greater than or equal to 0'),
  // Validate 'amount'
  query('amount')
    .optional() // Allow 'amount' to be omitted
    .isInt({ min: 0, max: 100 })
    .withMessage('amount must be an integer between 0 and 100'),
  query('authorId')
    .optional() // Allow 'AuthorId' to be omitted
    .isMongoId()
    .withMessage('AuthorId must be a valid MongoDB ObjectId'),
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
    .withMessage('Title must be between 4 and 100 characters'),
  body('licenseId').exists().withMessage('License cannot be empty').trim().isString().withMessage('License ID must be a string'),
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
    }),
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
]

export const addCommentValidators = [
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
    .withMessage('Content must be between 1 and 500 characters'),
]

router.get('/popular', tryCatch(getPopularTracks))

router.get('/:type', getTracksValidators, validate, tryCatch(getTracks))

router.get('/single/:trackId', isValidId('trackId'), tryCatch(getSingleTrack))

router.delete('/:trackId', isAuthenticated, isValidId('trackId'), tryCatch(deleteTrack))

router.post('/', isAuthenticated, trackUpload.single('audio'), uploadTrackValidators, validate, tryCatch(uploadTrack))

router.post('/:trackId/image', isAuthenticated, isValidId('trackId'), trackImageUpload.single('image'), tryCatch(uploadTrackImage))

router.post('/:trackId/like', isAuthenticated, isValidId('trackId'), tryCatch(toggleTrackLike))

router.post('/:trackId/stream', isValidId('trackId'), tryCatch(streamTrack))

router.post('/:trackId/comment', isAuthenticated, isValidId('trackId'), addCommentValidators, validate, tryCatch(addComment))

router.delete('/:trackId/comment/:commentId', isAuthenticated, isValidId('trackId'), isValidId('commentId'), tryCatch(deleteComment))

router.patch('/:trackId/comment/:commentId', isAuthenticated, isValidId('trackId'), isValidId('commentId'), tryCatch(toggleCommentLike))

export default router
