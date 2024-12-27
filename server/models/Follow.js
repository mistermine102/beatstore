import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const schema = new Schema({
  index: String,
  //index = "Follower[followerId]Followed[followedId]"
  followerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  followedId: {
    type: Schema.Types.ObjectId,
    refPath: 'User',
  },
  createdAt: Schema.Types.Date,
})

const Follow = mongoose.model('Follow', schema)

export default Follow
