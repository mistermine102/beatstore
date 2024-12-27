import express from 'express'

import { sampleUpload } from '../multer.js'
import { uploadSample, getSamples, getSingleSample, deleteSample, uploadSampleImage } from '../controllers/samples.js'
import { getSingleSampleValidators, uploadSampleValidators, deleteSampleValidators } from '../validators/samples.js'
import { trackImageUpload } from '../multer.js'

import { isAuthenticated } from '../middleware/auth.js'
import tryCatch from '../utils/tryCatch.js'

const router = express.Router()

router.post('/', isAuthenticated, uploadSampleValidators, sampleUpload.single('audio'), tryCatch(uploadSample))

router.post('/:id/image', isAuthenticated, trackImageUpload.single('image'), tryCatch(uploadSampleImage))

router.get('/page/:page', tryCatch(getSamples))

router.get('/:id', getSingleSampleValidators, tryCatch(getSingleSample))

router.delete('/', isAuthenticated, deleteSampleValidators, tryCatch(deleteSample))

export default router
