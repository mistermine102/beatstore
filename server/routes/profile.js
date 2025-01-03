import express from 'express'
import tryCatch from '../utils/tryCatch.js'
import { getProfile, toggleFollow, editProfile, uploadProfileImage } from '../controllers/profile.js'
import { isAuthenticated } from '../middleware/auth.js'
import { editProfileValidators } from '../validators/profile.js'
import { profileImageUpload } from '../multer.js'
import validate from '../middleware/validate.js'

const router = express.Router()

router.get('/:id', tryCatch(getProfile))

router.patch('/', isAuthenticated, editProfileValidators, validate, tryCatch(editProfile))

router.post('/image', isAuthenticated, profileImageUpload.single('image'), tryCatch(uploadProfileImage))

router.post('/:id/follow', isAuthenticated, tryCatch(toggleFollow))

export default router
