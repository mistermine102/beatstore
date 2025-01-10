import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  bpm: String,
  key: String,
  genre: String,
  playable: Boolean,
  audio: {
    type: Object,
    required: true,
  },
  image: Object,
  price: Object,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  type: String,
  totalLikes: Number,
  totalStreams: Number,
})

const Beat = mongoose.model('Beat', schema)

export default Beat
