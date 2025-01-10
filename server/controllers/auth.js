import Brcypt from 'bcryptjs'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import AppError from '../classes/AppError.js'

export const register = async (req, res) => {
  const { username, email, password } = req.body

  //check if user with that email exists
  const foundUser = await User.findOne({ email })

  if (foundUser) throw new AppError('EMAIL_NOT_AVAILABLE', 400)

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

  const token = jwt.sign(userPayload, process.env.JWT_SECRET)

  const responseUser = {
    ...savedUser._doc,
  }

  delete responseUser.password

  res.json({ token, user: responseUser })
}

export const login = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    throw new AppError('INVALID_CREDENTIALS', 400)
  }

  const isPasswordCorrect = await Brcypt.compare(password, user.password)

  if (!isPasswordCorrect) {
    throw new AppError('INVALID_CREDENTIALS', 400)
  }

  const userPayload = {
    id: user._id.toString(),
  }

  const token = jwt.sign(userPayload, process.env.JWT_SECRET)

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
