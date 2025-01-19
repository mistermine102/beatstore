import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const audioSchema = new Schema({
  _id: false,
  filename: String,
  duration: {
    seconds: Number,
    formatted: String,
  },
})

const schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  image: {
    filename: String,
    averageColor: Object,
  },
  audio: audioSchema,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  bpm: Number,
  key: String,
  genre: String,
  price: Object,
  playable: Boolean,
  totalLikes: Number,
  totalStreams: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Add a text index on the title to allow text search
schema.index({ title: 'text' });

const Track = mongoose.model('Track', schema)

export default Track
