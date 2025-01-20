import Follow from '../models/Follow.js'
import Like from '../models/Like.js'
import AppError from '../classes/AppError.js'

const checkUserInteraction = async (req, ids, type = 'track') => {
  try {
    if (!req.isAuthenticated) {
      // If not authenticated, return false for a single ID or an object with all IDs as false
      return Array.isArray(ids) ? Object.fromEntries(ids.map(id => [id, false])) : false
    }

    const isArray = Array.isArray(ids)
    const normalizedIds = isArray ? ids : [ids] // Normalize to an array

    // Determine model and index key based on type
    const Model = type === 'track' ? Like : Follow
    const prefix = type === 'track' ? `User-${req.userId}Track-` : `Follower-${req.userId}Followed-`

    const queryIds = normalizedIds.map(id => `${prefix}${id}`)

    // Fetch all matching documents
    const foundDocs = await Model.find({ _id: { $in: queryIds } }).select('_id')
    const matchedSet = new Set(foundDocs.map(doc => doc._id))

    // Map results for each id
    const result = Object.fromEntries(normalizedIds.map(id => [id, matchedSet.has(`${prefix}${id}`)]))

    return isArray ? result : result[ids] // Return object or single boolean
  } catch (err) {
    throw new AppError('Function failed', 500)
  }
}

export default checkUserInteraction
