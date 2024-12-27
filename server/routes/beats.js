import express from 'express'

import { beatUpload, trackImageUpload } from '../multer.js'
import { getBeats, uploadBeat, deleteBeat, updateBeat, getSingleBeat, uploadBeatImage } from '../controllers/beats.js'
import tryCatch from '../utils/tryCatch.js'
import { isAuthenticated } from '../middleware/auth.js'
import { getSingleBeatValidators, uploadBeatValidators, deleteBeatValidators } from '../validators/beats.js'

const router = express.Router()

router.get('/page/:page', tryCatch(getBeats))

router.get('/:id', getSingleBeatValidators, tryCatch(getSingleBeat))

router.post('/:id/image', isAuthenticated, trackImageUpload.single('image'), tryCatch(uploadBeatImage))

router.post('/', isAuthenticated, uploadBeatValidators, beatUpload.single('audio'), tryCatch(uploadBeat))

router.delete('/', isAuthenticated, deleteBeatValidators, tryCatch(deleteBeat))

router.patch('/', isAuthenticated, tryCatch(updateBeat))

export default router
