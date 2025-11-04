import express from 'express'
import { body } from 'express-validator'
import tryCatch from '../utils/tryCatch.js'
import validate from '../middleware/validate.js'
import { isAuthenticated } from '../middleware/auth.js'
import { createCheckoutSession, createConnectedAccount, getDashboardLoginLink, handleStripeEvents } from '../controllers/payments.js'

const router = express.Router()

const createCheckoutSessionValidators = [
  body('trackId')
    .exists()
    .withMessage('Track ID is required')
    .isMongoId()
    .withMessage('Track ID must be a valid MongoDB ObjectId')
    .escape(),
]

router.post('/create-checkout-session', createCheckoutSessionValidators, validate, tryCatch(createCheckoutSession))

router.post('/connected-account', isAuthenticated, tryCatch(createConnectedAccount))

router.get('/dashboard-link', isAuthenticated, tryCatch(getDashboardLoginLink))

router.post('/stripe-events', tryCatch(handleStripeEvents))

export default router