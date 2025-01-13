import Like from './models/Like.js'
import AppError from './classes/AppError.js'

export default async (req, trackIds) => {
  try {
    if (!req.isAuthenticated) {
      // If not authenticated, return false for a single ID or an object with all IDs as false
      return Array.isArray(trackIds) ? Object.fromEntries(trackIds.map(id => [id, false])) : false
    }

    //if trackIds is a single id (not an array) an array of this single id is created
    //if tracksIds is an array nothing happens
    const isArray = Array.isArray(trackIds)
    const ids = isArray ? trackIds : [trackIds] // Normalize to an array

    const likeIds = ids.map(id => `User-${req.userId}Track-${id}`)

     // Fetch all matching likes
    const foundLikes = await Like.find({ _id: { $in: likeIds } }).select('_id')
    const likedSet = new Set(foundLikes.map(like => like._id))

    // Map results for each trackId
    const result = Object.fromEntries(ids.map(id => [id, likedSet.has(`User-${req.userId}Track-${id}`)]))

    return isArray ? result : result[trackIds] // Return object or single boolean
  } catch (err) {
    throw new AppError('Isliked function failed', 500)
  }
}
