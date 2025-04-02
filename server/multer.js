import multer from 'multer'
import AppError from './classes/AppError.js'

const storage = multer.memoryStorage()

export const allowedAudioMimetypes = ['audio/wav', 'audio/wave', 'audio/mp3', 'audio/mpeg']
export const allowedImageMimetypes = ['image/jpeg', 'image/png']

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
  limits: {
    fileSize: 1024 * 1024 * 5, //5MB
  },
})

export const trackUpload = multer({
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
