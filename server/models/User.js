import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const schema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  refreshTokens: {
    type: [String],
    default: [],
  },
  specification: {
    type: String,
    default: '',
  },
  image: {
    type: Object,
    default: {
      filename: 'rudimentary-image.png',
    },
  },
  totalFollows: {
    type: Number,
    default: 0,
  },
  totalUploads: {
    type: Number,
    default: 0,
  },
  uploads: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Track',
      },
    ],
    default: [],
  },
  roles: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})
const User = mongoose.model('User', schema)

export default User
