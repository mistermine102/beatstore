import express from 'express'
import tryCatch from '../utils/tryCatch.js'
import { getLicenses } from '../controllers/licenses.js'

const router = express.Router()

router.get('/', tryCatch(getLicenses))

export default router