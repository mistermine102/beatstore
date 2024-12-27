import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const schema = new Schema({
  index: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  trackType: String,
  trackId: {
    type: Schema.Types.ObjectId,
    refPath: 'trackType',
  },
  createdAt: Schema.Types.Date,
  collectionName: String,
})

const Like = mongoose.model('Like', schema)

export default Like
