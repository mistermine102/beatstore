import express from 'express'
import { isAuthenticated } from '../middleware/auth.js'
import { uploadDrumkit, getDrumkits, getSingleDrumkit, uploadDrumkitImage } from '../controllers/drumkits.js'
import { getSingleDrumkitValidators, uploadDrumkitValidators } from '../validators/drumkits.js'
import tryCatch from '../utils/tryCatch.js'
import { drumkitUpload, trackImageUpload } from '../multer.js'

const router = express.Router()

router.get('/page/:page', tryCatch(getDrumkits))

router.get('/:id', getSingleDrumkitValidators, tryCatch(getSingleDrumkit))

router.post('/:id/image', isAuthenticated, trackImageUpload.single('image'), tryCatch(uploadDrumkitImage))

router.post('/', isAuthenticated, uploadDrumkitValidators, drumkitUpload.any('audio'), tryCatch(uploadDrumkit))

export default router
