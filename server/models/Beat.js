import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const schema = new Schema({
  title: String,
  bpm: String,
  key: String,
  genre: String,
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

const Beat = mongoose.model('Beat', schema)

export default Beat
