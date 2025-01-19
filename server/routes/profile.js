import express from 'express';
import tryCatch from '../utils/tryCatch.js';
import { getSingleProfile, toggleFollow, editProfile, uploadProfileImage } from '../controllers/profile.js';
import { isAuthenticated } from '../middleware/auth.js';
import { editProfileValidators } from '../validators/profile.js';
import { profileImageUpload } from '../multer.js';
import validate from '../middleware/validate.js';
import isValidId from '../middleware/isValidId.js'

const router = express.Router();

router.get('/:profileId', isValidId('profileId'), tryCatch(getSingleProfile));

router.patch('/', isAuthenticated, editProfileValidators, validate, tryCatch(editProfile));

router.post('/image', isAuthenticated, profileImageUpload.single('image'), tryCatch(uploadProfileImage));

router.post('/:profileId/follow', isValidId('profileId'),  isAuthenticated, tryCatch(toggleFollow));

export default router;
