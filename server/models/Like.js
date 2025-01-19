import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const schema = new Schema({
  _id: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  trackId: {
    type: Schema.Types.ObjectId,
    refPath: 'trackType',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Like = mongoose.model('Like', schema)

export default Like
