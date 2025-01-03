import express from 'express'

import { beatUpload, trackImageUpload } from '../multer.js'
import { getBeats, uploadBeat, deleteBeat, updateBeat, getSingleBeat, uploadBeatImage } from '../controllers/beats.js'
import tryCatch from '../utils/tryCatch.js'
import { isAuthenticated } from '../middleware/auth.js'
import { getSingleBeatValidators, uploadBeatValidators } from '../validators/beats.js'
import validate from '../middleware/validate.js'

const router = express.Router()

router.get('/', tryCatch(getBeats))

router.get('/:id', getSingleBeatValidators, validate, tryCatch(getSingleBeat))

router.post('/:id/image', isAuthenticated, trackImageUpload.single('image'), tryCatch(uploadBeatImage))

router.post('/', isAuthenticated, beatUpload.single('audio'), uploadBeatValidators, validate, tryCatch(uploadBeat))

router.delete('/', isAuthenticated, tryCatch(deleteBeat))

router.patch('/', isAuthenticated, tryCatch(updateBeat))

export default router
