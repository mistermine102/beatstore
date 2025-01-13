import express from 'express'
import { body, query, param } from 'express-validator'
import tryCatch from '../utils/tryCatch.js'
import { isAuthenticated } from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import { trackUpload, trackImageUpload } from '../multer.js'
import { getTracks, uploadTrack, streamTrack, toggleTrackLike, uploadTrackImage, getSingleTrack, deleteTrack } from '../controllers/tracks.js'
import isValidId from '../middleware/isValidId.js'

const router = express.Router()

const getTracksValidators = [
  param('type')
    .exists()
    .withMessage('type is required')
    .isIn(['beat', 'sample', 'drumkit'])
    .withMessage('type must be one of: beat, sample, drumkit'),
  query('start')
    .optional() // Allow 'start' to be omitted
    .isInt({ min: 0 })
    .withMessage('start must be an integer greater than or equal to 0'),
  // Validate 'amount'
  query('amount')
    .optional() // Allow 'amount' to be omitted
    .isInt({ min: 0, max: 100 })
    .withMessage('amount must be an integer between 0 and 100'),
  query('bpmMin').optional().isInt({ min: 0 }).withMessage('bpmMin must be a positive integer'),
  query('bpmMax').optional().isInt({ min: 0 }).withMessage('bpmMax must be a positive integer'),
]

const uploadTrackValidators = [
  body('type')
    .exists()
    .withMessage('Type cannot be empty')
    .trim()
    .isString()
    .withMessage('Type must be a string')
    .isIn(['beat', 'sample', 'drumkit']),
  body('title').exists().withMessage('Title cannot be empty').trim().isString().withMessage('Title must be a string').isLength({ min: 4 }),
]

router.get('/:type', getTracksValidators, validate, tryCatch(getTracks))

router.get('/single/:trackId', isValidId('trackId'), tryCatch(getSingleTrack))

router.delete('/:trackId', isAuthenticated, isValidId('trackId'), tryCatch(deleteTrack))

router.post('/', isAuthenticated, trackUpload.single('audio'), uploadTrackValidators, validate, tryCatch(uploadTrack))

router.post('/:trackId/image', isAuthenticated, isValidId('trackId'), trackImageUpload.single('image'), tryCatch(uploadTrackImage))

router.post('/:trackId/like', isAuthenticated, isValidId('trackId'), tryCatch(toggleTrackLike))

router.post('/:trackId/stream', isValidId('trackId'), tryCatch(streamTrack))

export default router
