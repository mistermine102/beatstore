import Like from './models/Like.js'

export default async (req, trackType, track) => {
  let isLiked = false

  if (req.isAuthenticated) {
    const index = trackType + track._id.toString() + 'User' + req.userId.toString()
    const like = await Like.findOne({ index })

    if (like) {
      isLiked = true
    }
  }

  return isLiked
}
