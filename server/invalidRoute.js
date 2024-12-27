import AppError from './classes/AppError.js'

export default (req, res) => {
  //route not found 404 error
  throw new AppError('Invalid route', 404)
}
