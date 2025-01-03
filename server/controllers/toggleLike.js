import Like from '../models/Like.js'
import AppError from '../classes/AppError.js'

export const toggleLike = async (req, res) => {
  const { trackType, track, collectionName } = req

  if (!trackType || !track || !collectionName) throw new AppError('INVALID_DATA', 400)

  const id = track._id.toString()

  //create index and find the like
  const index = trackType + id + 'User' + req.userId.toString() // ex. Beat123123User123123
  const like = await Like.findOne({ index })

  //toggle like
  if (!like) {
    //update track's total likes
    track.totalLikes++

    //create new like
    const newLike = new Like({
      index: trackType + id + 'User' + req.userId.toString(),
      userId: req.userId,
      trackType,
      trackId: id,
      createdAt: new Date(),
      collectionName,
    })

    await newLike.save()
  } else {
    //update track's likes
    track.totalLikes--

    //update user's likes
    await like.deleteOne()
  }

  await track.save()

  res.json({ likes: track.totalLikes })
}
