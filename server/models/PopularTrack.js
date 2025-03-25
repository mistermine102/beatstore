import mongoose from 'mongoose'

const popularTrackSchema = new mongoose.Schema({
  track: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track',
    required: true,
  },
  streams: Number,
})

const PopularTrack = mongoose.model('PopularTrack', popularTrackSchema)

export default PopularTrack
