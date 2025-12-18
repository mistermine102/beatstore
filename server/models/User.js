import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const schema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
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
  socialLinks: {
    type: [
      {
        _id: false,
        platform: String,
        url: String,
      },
    ],
    default: [],
  },
  roles: {
    type: [String],
    default: [],
  },
  notificationRules: {
    type: {
      _id: false,
      trackVerified: {
        email: Boolean,
      },
      trackLiked: {
        email: Boolean,
      },
      trackCommented: {
        email: Boolean,
      },
    },
    default: {
      trackVerified: {
        email: true,
      },
      trackLiked: {
        email: true,
      },
      trackCommented: {
        email: true,
      },
    },
  },
  stripe: {
    type: {
      _id: false,
      connectedAccountId: String,
      isConnectedAccountLinked: Boolean,
    },
    default: {
      connectedAccountId: null,
      isConnectedAccountLinked: false,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  verifiedAt: {
    type: Date,
    default: null,
  },
})

const unverifiedUserSchema = schema.clone()

unverifiedUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 })

const User = mongoose.model('User', schema)

export const UnverifiedUser = mongoose.model('UnverifiedUser', unverifiedUserSchema)

export default User
