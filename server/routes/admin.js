import express from 'express'
import { verifyTrack, getUnverifiedTracks } from '../controllers/admin.js'
import tryCatch from '../utils/tryCatch.js'
import { hasRole, isAuthenticated } from '../middleware/auth.js'

const router = express.Router()

router.post('/tracks/verify/:trackId', isAuthenticated, hasRole('admin'), tryCatch(verifyTrack))

router.get('/tracks/unverified', isAuthenticated, hasRole('admin'), tryCatch(getUnverifiedTracks))

export default router
