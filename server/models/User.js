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
      type: Schema.Types.ObjectId,
      ref: 'Track',
    },
  ],
  createdAt: Date,
})
const User = mongoose.model('User', schema)

export default User
