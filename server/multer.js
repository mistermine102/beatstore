import multer from 'multer'
import AppError from './classes/AppError.js'

const storage = multer.memoryStorage()

const allowedAudioMimetypes = ['audio/wav', 'audio/wave', 'audio/mp3', 'audio/mpeg']
const allowedImageMimetypes = ['image/jpeg', 'image/png']

export const trackImageUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!allowedImageMimetypes.includes(file.mimetype.toLowerCase())) {
      return cb(new AppError('Only images are allowed', 400))
    }
    cb(null, true)
  },
  limits: {
    //5MB
    fileSize: 1024 * 1024 * 5,
  },
})

export const profileImageUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!allowedImageMimetypes.includes(file.mimetype.toLowerCase())) {
      return cb(new AppError('Only images are allowed', 400))
    }
    cb(null, true)
  },
  limits: {
    //5MB
    fileSize: 1024 * 1024 * 5,
  },
})

export const beatUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!allowedAudioMimetypes.includes(file.mimetype.toLowerCase())) {
      cb(new AppError('Only audio files are allowed', 400))
    }
    cb(null, true)
  },
  limits: {
    //50MB
    fileSize: 1024 * 1024 * 50,
  },
})

export const sampleUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!allowedAudioMimetypes.includes(file.mimetype.toLowerCase())) {
      cb(new AppError('Only audio files are allowed', 400))
    }
    cb(null, true)
  },
  limits: {
    //50MB
    fileSize: 1024 * 1024 * 50,
  },
})

export const drumkitUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!allowedAudioMimetypes.includes(file.mimetype.toLowerCase())) {
      cb(new AppError('Only audio files are allowed', 400))
    }
    cb(null, true)
  },
  limits: {
    //250MB
    fileSize: 1024 * 1024 * 250,
  },
})
