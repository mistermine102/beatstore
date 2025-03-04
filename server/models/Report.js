import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const schema = new Schema({
  track: {
    type: Schema.Types.ObjectId,
    ref: 'Track',
    required: true
  },
  reporter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    maxLength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'resolved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Report = mongoose.model('Report', schema)
export default Report 