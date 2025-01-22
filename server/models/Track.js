import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const audioSchema = new Schema({
  _id: false,
  filename: String,
  waveform: {
    samples: [Number],
  },
  duration: {
    seconds: Number,
    formatted: String,
  },
})

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  score: {
    type: Number, // Score to track upvotes and downvotes
    default: 0,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the user who wrote the comment
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
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
  comments: {
    type: [commentSchema],
    default: [],
  }, // Add comments array, each comment with content and score
})

// Add a text index on the title to allow text search
schema.index({ title: 'text' })

const Track = mongoose.model('Track', schema)

export default Track
