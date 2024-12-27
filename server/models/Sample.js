import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const schema = new Schema({
  title: String,
  bpm: String,
  key: String,
  audio: Object,
  image: Object,
  price: Object,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  trackType: String,
  totalLikes: Number,
  totalStreams: Number,
})

const Sample = mongoose.model('Sample', schema)

export default Sample
