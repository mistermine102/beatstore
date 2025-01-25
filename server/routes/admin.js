import express from 'express'
import { approveTrack } from '../controllers/admin.js'
import tryCatch from '../utils/tryCatch.js'
import { hasRole, isAuthenticated } from '../middleware/auth.js'

const router = express.Router()

// Approve a track by ID
router.post('tracks/approve/:trackId', isAuthenticated, hasRole('admin'), tryCatch(approveTrack))

export default router
