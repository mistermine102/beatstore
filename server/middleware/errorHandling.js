import { MulterError } from 'multer'

export default (err, req, res, next) => {
  let { statusCode = 500, message = 'Something went wrong', errors = [] } = err

  //handle multer errors
  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      statusCode = 400
      message = 'File too large'
    }
  }

  console.log('ERROR', statusCode, message )
  console.log(err)

  if (statusCode === 500) {
    message = 'Something went wrong'
  }

  res.status(statusCode).json({
    message,
    status: statusCode,
    errors,
  })
}
