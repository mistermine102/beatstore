import Track from '../models/Track.js'
import AppError from '../classes/AppError.js'

export const addComment = async (req, res) => {
  const { content } = req.body
  const { trackId } = req.params

  //find track
  const track = await Track.findById(trackId)
  if (!track) throw new AppError('NO_TRACK_FOUND', 404)

  //add comment to track comments
  track.comments.push({
    content,
    score: 0,
    author: req.userId,
  })

  //save track
  await track.save()

  res.json({ trackId })
}

export const deleteComment = async (req, res) => {
  const { trackId, commentId } = req.params

  //find track
  const track = await Track.findById(trackId)
  if (!track) throw new AppError('TRACK_NOT_FOUND', 404)

  //find comment
  const comment = track.comments.find(el => el._id.equals(commentId))
  if (!comment) throw new AppError('COMMENT_NOT_FOUND', 404)

  //authorize user
  if (!comment.author.equals(req.userId)) throw new AppError('NOT_AUTHORIZED', 401)

  //remove comment from track comments
  track.comments = track.comments.filter(el => !el._id.equals(commentId))

  //save track
  await track.save()

  res.json({ commentId })
}

export const toggleCommentScore = async (req, res) => {
  const { trackId, commentId } = req.params

  //find track
  const track = await Track.findById(trackId)
  if (!track) throw new AppError('TRACK_NOT_FOUND', 404)

  //find comment
  const comment = track.comments.find(el => el._id.equals(commentId))
  if (!comment) throw new AppError('COMMENT_NOT_FOUND', 404)

    //

  res.json({ commentId: comment._id })
}
