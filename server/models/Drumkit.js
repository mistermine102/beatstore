import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const schema = new Schema({
  title: String,
  price: Object,
  image: Object,
  playable: Boolean,
  directories: [
    {
      title: String,
      drums: [
        {
          title: String,
          //using mixed type because String doesn't work for some reason
          type: Schema.Types.Mixed,
          audio: Object,
        },
      ],
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  type: String,
  totalLikes: Number,
})

const Drumkit = mongoose.model('Drumkit', schema)

export default Drumkit
