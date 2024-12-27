import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const schema = new Schema({
  username: String,
  email: String,
  password: String,
  specification: String,
  image: Object,
  totalFollows: Number,
  totalUploads: Number,
  uploads: [
    {
      trackType: String,
      createdAt: Date,
      trackId: {
        type: Schema.Types.ObjectId,
        refPath: 'uploads.trackType',
      },
    },
  ],
  createdAt: Date,
})
const User = mongoose.model('User', schema)

export default User
