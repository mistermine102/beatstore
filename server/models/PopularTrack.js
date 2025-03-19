import mongoose from 'mongoose'

const popularTrackSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track',
    required: true,
  },
  streams: Number,
})

const PopularTrack = mongoose.model('PopularTrack', popularTrackSchema)

export default PopularTrack
