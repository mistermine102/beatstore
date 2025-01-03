import express from 'express'

import { register, login, getUser } from '../controllers/auth.js'

import { loginValidators, registerValidators } from '../validators/auth.js'

import tryCatch from '../utils/tryCatch.js'
import validate from '../middleware/validate.js'

const router = express.Router()

router.post('/register', registerValidators, validate, tryCatch(register))

router.post('/login', loginValidators, validate, tryCatch(login))

router.get('/auth/:token', tryCatch(getUser))

export default router
