import express from 'express'

import tryCatch from '../utils/tryCatch.js'

import { toggleLike } from '../controllers/toggleLike.js'
import { toggleBeatLike, toggleSampleLike, toggleDrumkitLike } from '../middleware/toggleLike.js'
import { isAuthenticated } from '../middleware/auth.js'

const router = express.Router()

router.post('/beats/:id/like', isAuthenticated, tryCatch(toggleBeatLike), tryCatch(toggleLike))

router.post('/samples/:id/like', isAuthenticated, tryCatch(toggleSampleLike), tryCatch(toggleLike))

router.post('/drumkits/:id/like', isAuthenticated, tryCatch(toggleDrumkitLike), tryCatch(toggleLike))

export default router
