import Brcypt from 'bcryptjs'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import AppError from '../classes/AppError.js'

export const register = async (req, res) => {
  //validate data
  const { errors } = validationResult(req)
  if (errors && errors.length) {
    throw new AppError('Invalid input', 400, errors)
  }

  const { username, email, password } = req.body

  //hash password
  const hashedPassword = await Brcypt.hash(password, 12)

  //create and save user
  const newUser = new User({
    username,
    email,
    image: {
      filename: 'rudimentary-image.png',
    },
    specification: '',
    password: hashedPassword,
    totalFollows: 0,
    totalUploads: 0,
    uploads: [],
    createdAt: new Date(),
  })

  const savedUser = await newUser.save()

  //generate and send jwt token
  const userPayload = {
    id: savedUser._id.toString(),
  }

  const token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 * 7 })

  const responseUser = {
    ...savedUser._doc,
  }

  delete responseUser.password

  res.json({ token, user: responseUser })
}

export const login = async (req, res) => {
  const { errors } = validationResult(req)

  if (errors && errors.length) {
    throw new AppError('Invalid input', 400, errors)
  }

  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    throw new AppError('Invalid email or password', 400)
  }

  const isPasswordCorrect = await Brcypt.compare(password, user.password)

  if (!isPasswordCorrect) {
    throw new AppError('Invalid email or password', 400)
  }

  const userPayload = {
    id: user._id.toString(),
  }

  const token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 * 7 })

  const responseUser = {
    ...user._doc,
  }

  delete responseUser.password

  res.json({ token, user: responseUser })
}

export const getUser = async (req, res) => {
  const { token } = req.params

  const { id } = jwt.verify(token, process.env.JWT_SECRET)

  const user = await User.findById(id)

  if (!user) {
    throw new AppError("Can't find a user", 400)
  }

  const responseUser = {
    ...user._doc,
  }

  delete responseUser.password

  res.json({ user: responseUser })
}