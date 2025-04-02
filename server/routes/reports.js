import express from 'express'
import { createReport, getReports, updateReportStatus } from '../controllers/reports.js'
import { isAuthenticated, hasRole } from '../middleware/auth.js'
import tryCatch from '../utils/tryCatch.js'
import { body } from 'express-validator'
import validate from '../middleware/validate.js'

const router = express.Router()

const reportValidators = [
  body('trackId').notEmpty().withMessage('Track ID is required'),
  body('message')
    .notEmpty().withMessage('Message is required')
    .isLength({ max: 500 }).withMessage('Message must be less than 500 characters')
    .escape()
]

// Regular user routes
router.post('/', isAuthenticated, reportValidators, validate, tryCatch(createReport))

// Admin routes
router.get('/', isAuthenticated, hasRole('admin'), tryCatch(getReports))
router.patch('/:reportId', isAuthenticated, hasRole('admin'), tryCatch(updateReportStatus))

export default router 