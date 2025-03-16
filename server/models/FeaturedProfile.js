import mongoose from 'mongoose'

const featuredProfileSchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    trackId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Track',
      required: true,
    },
    featuredUntil: {
      type: Date,
      required: true,
    },
    // Optional: to easily identify when it's set to "infinite"
    isInfinite: {
      type: Boolean,
      default: false,
    },
    // Optional: to track who added this featured profile
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

// Index to make queries faster
featuredProfileSchema.index({ featuredUntil: 1 })

// Create compound index to ensure uniqueness of profileId and trackId combination
featuredProfileSchema.index({ profileId: 1, trackId: 1 }, { unique: true })

const FeaturedProfile = mongoose.model('FeaturedProfile', featuredProfileSchema)

export default FeaturedProfile