import express from 'express'
import { body } from 'express-validator'
import tryCatch from '../utils/tryCatch.js'
import { isAuthenticated } from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import { trackUpload, trackImageUpload } from '../multer.js'
import { getTracks, uploadTrack, streamTrack, toggleTrackLike, uploadTrackImage, getSingleTrack, deleteTrack } from '../controllers/tracks.js'
import isValidId from '../middleware/isValidId.js'

const router = express.Router()

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

router.get('/:type', tryCatch(getTracks))

router.get('/single/:trackId', isValidId('trackId'), tryCatch(getSingleTrack))

router.delete('/:trackId', isAuthenticated, isValidId('trackId'), tryCatch(deleteTrack))

router.post('/', isAuthenticated, trackUpload.single('audio'), uploadTrackValidators, validate, tryCatch(uploadTrack))

router.post('/:trackId/image', isAuthenticated, isValidId('trackId'), trackImageUpload.single('image'), tryCatch(uploadTrackImage))

router.post('/:trackId/like', isAuthenticated, isValidId('trackId'), tryCatch(toggleTrackLike))

router.post('/:trackId/stream', isValidId('trackId'), tryCatch(streamTrack))

export default router
