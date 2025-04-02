import { fileTypeFromBuffer } from 'file-type'
import AppError from '../classes/AppError.js'
import tryCatch from '../utils/tryCatch.js'

export const validateFileType = allowedMimetypes =>
  tryCatch(async (req, res, next) => {
    if (!req.file) throw new AppError('FILE_MISSING', 400)

    const fileType = await fileTypeFromBuffer(req.file.buffer)
    if (!fileType || !allowedMimetypes.includes(fileType.mime)) throw new AppError('INVALID_FILE_TYPE', 400)

    return next()
  })
