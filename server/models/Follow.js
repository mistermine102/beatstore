import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const schema = new Schema({
  _id: String,
  followerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  followedId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Follow = mongoose.model('Follow', schema)

export default Follow
