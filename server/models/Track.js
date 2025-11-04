import mongoose from 'mongoose'
import { Schema } from 'mongoose'
import { licenseSchema } from './License.js'

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
  totalLikes: {
    type: Number, // Score to track upvotes and downvotes
    default: 0,
  },
  likes: [Schema.Types.ObjectId],
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
  description: {
    type: String,
    maxLength: 500,
    default: '',
  },
  image: {
    filename: {
      type: String,
      default: 'rudimentary-image.png',
    },
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
  instruments: [String],
  mood: String,
  pricingType: {
    type: String,
    enum: ['free', 'paid'],
    default: 'free',
  },
  sellThrough: {
    type: String,
    enum: ['platform', 'external', null],
    default: null,
  },
  price: Object,
  playable: Boolean,
  totalLikes: Number,
  totalStreams: Number,
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comments: {
    type: [commentSchema],
    default: [],
  },
  license: {
    type: licenseSchema,
    required: true,
  },
  streamsHistory: Object
})

// Add a text index on the title to allow text search
schema.index({ title: 'text' })

const Track = mongoose.model('Track', schema)

export const UnverifiedTrack = mongoose.model('UnverifiedTrack', schema)

export default Track
