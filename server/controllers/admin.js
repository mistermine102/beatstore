import Track, { UnverifiedTrack } from '../models/Track.js'
import AppError from '../classes/AppError.js'
import formatTrackData from '../utils/formatTrackData.js'
import User from '../models/User.js'
import { sendNotificationEmail } from '../emails/emails.js'

/**
 * Approve a track by moving it from "unverifiedTracks" to "tracks".
 */
export const verifyTrack = async (req, res) => {
  const { trackId } = req.params
  const { approve } = req.body

  // Fetch the track from the "unverifiedTracks" collection
  const track = await UnverifiedTrack.findById(trackId)
  if (!track) throw new AppError('UNVERIFIED_TRACK_NOT_FOUND', 404)

  if (approve) {
    //approve a track
    await Track.create({ ...track.toObject(), verified: true })

    //update author uploads
    const author = await User.findById(track.author)
    author.uploads.push(track._id)
    author.totalUploads++
    await author.save()

    //remove unverified track
    await UnverifiedTrack.findByIdAndDelete(trackId)

    //send email
    if (author.notificationRules.trackVerified.email) {
      await sendNotificationEmail(author, 'trackVerified', { track })
    }
  } else {
    //remove track
    await UnverifiedTrack.findByIdAndDelete(trackId)
  }

  res.json({ trackId: track._id })
}

//controller to get ALL of the unverified tracks
export const getUnverifiedTracks = async (req, res) => {
  const tracks = await UnverifiedTrack.find().populate('tiers.license')

  const formattedTracks = await Promise.all(
    tracks.map(async track => {
      //attach audio and image url
      const formattedTrack = await formatTrackData(track)
      return formattedTrack
    })
  )

  res.json({ tracks: formattedTracks })
}
