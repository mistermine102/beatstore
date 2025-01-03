import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const schema = new Schema({
  title: String,
  bpm: String,
  key: String,
  audio: Object,
  image: Object,
  price: Object,
  playable: Boolean,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  type: String,
  totalLikes: Number,
  totalStreams: Number,
})

const Sample = mongoose.model('Sample', schema)

export default Sample
