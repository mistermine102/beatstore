import express from 'express'

import { sampleUpload } from '../multer.js'
import { uploadSample, getSamples, getSingleSample, deleteSample, uploadSampleImage } from '../controllers/samples.js'
import { getSingleSampleValidators, uploadSampleValidators, deleteSampleValidators } from '../validators/samples.js'
import { trackImageUpload } from '../multer.js'

import { isAuthenticated } from '../middleware/auth.js'
import tryCatch from '../utils/tryCatch.js'
import validate from '../middleware/validate.js'

const router = express.Router()

router.post('/', isAuthenticated, uploadSampleValidators, validate, sampleUpload.single('audio'), tryCatch(uploadSample))

router.post('/:id/image', isAuthenticated, trackImageUpload.single('image'), tryCatch(uploadSampleImage))

router.get('/', tryCatch(getSamples))

router.get('/:id', getSingleSampleValidators, validate, tryCatch(getSingleSample))

router.delete('/', isAuthenticated, deleteSampleValidators, validate, tryCatch(deleteSample))

export default router
