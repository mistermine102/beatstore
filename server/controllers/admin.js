import Track, { UnverifiedTrack } from '../models/Track.js'
import AppError from '../classes/AppError.js'
import formatTrackData from '../utils/formatTrackData.js'

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
    await UnverifiedTrack.findByIdAndDelete(trackId)
  } else {
    //remove track
    await UnverifiedTrack.findByIdAndDelete(trackId)
  }

  res.json({ trackId: track._id })
}

//controller to get ALL of the unverified tracks
export const getUnverifiedTracks = async (req, res) => {
  const tracks = await UnverifiedTrack.find()

  const formattedTracks = await Promise.all(
    tracks.map(async track => {
      //attach audio and image url
      const formattedTrack = await formatTrackData(track)
      return formattedTrack
    })
  )

  res.json({ tracks: formattedTracks })
}
