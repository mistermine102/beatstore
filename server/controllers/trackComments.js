import Track from '../models/Track.js'
import AppError from '../classes/AppError.js'
import { sendTrackCommentedEmail } from '../emails/emails.js'

// Helper function to find a track and a comment
const findTrackAndComment = async (trackId, commentId) => {
  const track = await Track.findById(trackId)
  if (!track) throw new AppError('TRACK_NOT_FOUND', 404)

  const comment = track.comments.find(el => el._id.equals(commentId))
  if (!comment) throw new AppError('COMMENT_NOT_FOUND', 404)

  return { track, comment }
}

export const addComment = async (req, res) => {
  const { content } = req.body
  const { trackId } = req.params

  // Find track
  const track = await Track.findById(trackId).populate('author', 'email')
  if (!track) throw new AppError('TRACK_NOT_FOUND', 404)

  // Add comment to track
  track.comments.push({
    content,
    score: 0,
    author: req.userId,
  })

  // Save track
  await track.save()

  //send email
  await sendTrackCommentedEmail(track.author.email, track)

  res.json({ trackId })
}

export const deleteComment = async (req, res) => {
  const { trackId, commentId } = req.params

  // Find track and comment
  const { track, comment } = await findTrackAndComment(trackId, commentId)

  // Authorize user
  if (!comment.author.equals(req.userId)) throw new AppError('NOT_AUTHORIZED', 401)

  // Remove comment
  track.comments = track.comments.filter(el => !el._id.equals(commentId))

  // Save track
  await track.save()

  res.json({ commentId })
}

export const toggleCommentLike = async (req, res) => {
  const { trackId, commentId } = req.params

  const { track, comment } = await findTrackAndComment(trackId, commentId)

  const like = comment.likes.find(el => el.equals(req.userId))

  if (!like) {
    //add a like
    comment.likes.push(req.userId)
    comment.totalLikes++
  } else {
    //remove a like
    comment.likes = comment.likes.filter(el => !el.equals(req.userId))
    comment.totalLikes--
  }

  await track.save()

  res.json({ totalLikes: comment.totalLikes })
}
