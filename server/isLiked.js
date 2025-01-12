import Like from './models/Like.js'

export default async (req, trackId) => {
  let isLiked = false

  if (req.isAuthenticated) {
    const likeId = `User-${req.userId}Track-${trackId}`
    const foundLike = await Like.findById(likeId)

    if (foundLike) isLiked = true
  }

  return isLiked
}
