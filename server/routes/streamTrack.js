import express from 'express'
import tryCatch from '../utils/tryCatch.js'
import { streamTrack } from '../controllers/streamTrack.js'
import { streamBeat, streamSample } from '../middleware/streamTrack.js'

const router = express.Router()

router.post('/beats/:id/stream', tryCatch(streamBeat), tryCatch(streamTrack))

router.post('/samples/:id/stream', tryCatch(streamSample), tryCatch(streamTrack))

export default router
