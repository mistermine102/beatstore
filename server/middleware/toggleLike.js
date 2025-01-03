import Beat from '../models/Beat.js'
import Sample from '../models/Sample.js'
import Drumkit from '../models/Drumkit.js'
import Mongoose from 'mongoose'
import AppError from '../classes/AppError.js'

export const toggleBeatLike = async (req, res, next) => {
  const { id } = req.params
  if (!Mongoose.Types.ObjectId.isValid(id)) throw new AppError('Invalid id', 400)

  const beat = await Beat.findById(id)
  if (!beat) throw new AppError('Cannot find a track', 400)

  req.trackType = 'beat'
  req.track = beat
  req.collectionName = 'beats'

  next()
}

export const toggleSampleLike = async (req, res, next) => {
  const { id } = req.params
  if (!Mongoose.Types.ObjectId.isValid(id)) throw new AppError('Invalid id', 400)

  const sample = await Sample.findById(id)
  if (!sample) throw new AppError('Cannot find a track', 400)

  req.trackType = 'Sample'
  req.track = sample
  req.collectionName = 'samples'

  next()
}

export const toggleDrumkitLike = async (req, res, next) => {
  const { id } = req.params
  if (!Mongoose.Types.ObjectId.isValid(id)) throw new AppError('Invalid id', 400)

  const drumkit = await Drumkit.findById(id)
  if (!drumkit) throw new AppError('Cannot find a track', 400)

  req.trackType = 'Drumkit'
  req.track = drumkit
  req.collectionName = 'drumkits'

  next()
}
