import mongoose from 'mongoose'
import Track, { UnverifiedTrack } from '../models/Track.js'
import AppError from '../classes/AppError.js'

/**
 * Approve a track by moving it from "unverifiedTracks" to "tracks".
 */
export const approveTrack = async (req, res) => {
  const { trackId } = req.params

  // Fetch the track from the "unverifiedTracks" collection
  const track = await UnverifiedTrack.findById(trackId)
  if (!track) throw new AppError('UNVERIFIED_TRACK_NOT_FOUND', 404)

  // Create a new instance in the "tracks" collection
  await Track.create({ ...track.toObject(), verified: true })

  // Remove the track from the "unverifiedTracks" collection
  await UnverifiedTrack.findByIdAndDelete(trackId)

  res.status(200).json({ message: 'Track approved and moved to tracks successfully' })
}
