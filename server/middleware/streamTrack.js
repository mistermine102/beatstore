import Beat from '../models/Beat.js'
import Sample from '../models/Sample.js'
import Mongoose from 'mongoose'
import AppError from '../classes/AppError.js'

export const streamBeat = async (req, res, next) => {
  const { id } = req.params
  if (!Mongoose.Types.ObjectId.isValid(id)) throw new AppError('Invalid id', 400)

  const beat = await Beat.findById(id)
  if (!beat) throw new AppError('Cannot find a track', 400)

  req.track = beat

  next()
}

export const streamSample = async (req, res, next) => {
  const { id } = req.params
  if (!Mongoose.Types.ObjectId.isValid(id)) throw new AppError('Invalid id', 400)

  const sample = await Sample.findById(id)
  if (!sample) throw new AppError('Cannot find a track', 400)

  req.track = sample

  next()
}
