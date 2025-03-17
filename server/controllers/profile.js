import User from '../models/User.js'
import AppError from '../classes/AppError.js'
import Follow from '../models/Follow.js'
import Sharp from 'sharp'
import { getAverageColor } from 'fast-average-color-node'
import { uploadFileToS3, generateSignedUrl, deleteFileFromS3 } from '../s3.js'
import checkUserInteraction from '../utils/checkUserInteraction.js'
import Track, { UnverifiedTrack } from '../models/Track.js'
import Like from '../models/Like.js'
import FeaturedProfile from '../models/FeaturedProfile.js'
import formatTrackData from '../utils/formatTrackData.js'
import hasDuplicate from '../utils/hasDuplicate.js'

const sanitizeProfile = profile => {
  const { image, isFollowed, specification, totalUploads, totalFollows, username, _id, socialLinks } = profile
  return { image, isFollowed, specification, totalUploads, totalFollows, username, _id, socialLinks }
}

export const getSingleProfile = async (req, res) => {
  const { profileId: userId } = req.params

  const user = await User.findById(userId)
  if (!user) throw new AppError('USER_NOT_FOUND', 400)

  const formattedProfile = { ...user._doc }

  //determine if a profile is followed by a user
  formattedProfile.isFollowed = await checkUserInteraction(req, userId, 'profile')

  //attach profile image url
  formattedProfile.image.url = await generateSignedUrl(user.image.filename)

  res.json({ profile: sanitizeProfile(formattedProfile) })
}

export const getProfiles = async (req, res) => {
  const start = parseInt(req.query.start) || 0 // Defaults to 0 if not provided
  const amount = parseInt(req.query.amount) || 10 // Defaults to 10 if not provided
  const { followed } = req.query

  const filter = {}

  if (followed) {
    if (!req.isAuthenticated) throw new AppError('NOT_AUTHENTICATED', 401)
    //find ids of tracks liked by a user and add them to the filter
    const follows = await Follow.find({ followerId: req.userId })
    const followsIds = follows.map(el => el.followedId)
    filter._id = { $in: followsIds }
  }

  //only populate username on author
  const profiles = await User.find(filter).skip(start).limit(amount)
  const profileIds = profiles.map(el => el._id)

  //create an object where keys are profileIds and values are whether they're followed
  const follows = await checkUserInteraction(req, profileIds, 'profile')

  const formattedProfiles = await Promise.all(
    profiles.map(async profile => {
      const formattedProfile = { ...profile._doc }

      //determine if a profile is followed by a user
      formattedProfile.isFollowed = follows[profile._id]

      //attach profile image url
      formattedProfile.image.url = await generateSignedUrl(profile.image.filename)
      return sanitizeProfile(formattedProfile)
    })
  )

  // Check if there are more tracks available in the database
  const totalProfilesCount = await User.countDocuments(filter)
  const isMore = totalProfilesCount > start + amount

  res.json({ profiles: formattedProfiles, isMore })
}

export const toggleFollow = async (req, res) => {
  const followerId = req.userId
  const followedId = req.params.profileId

  const followedUser = await User.findById(followedId)
  if (!followedUser) throw new AppError('USER_NOT_FOUND', 400)

  //determine wheter we follow or unfollow
  const followId = 'Follower-' + followerId + 'Followed-' + followedId
  const follow = await Follow.findById(followId)

  if (!follow) {
    //increment followed user follows
    followedUser.totalFollows++

    //create new follow
    const newFollow = new Follow({
      _id: followId,
      followerId,
      followedId,
    })

    await newFollow.save()
  } else {
    //decrement followed user follows
    followedUser.totalFollows--

    //delete follow
    await follow.deleteOne()
  }

  await followedUser.save()

  res.json({ totalFollows: followedUser.totalFollows })
}

export const editProfile = async (req, res) => {
  const user = await User.findById(req.userId)

  //authorize
  if (!user._id.equals(req.userId)) throw new AppError('Not authorized', 403)

  const { username, specification, socialLinks } = req.body

  const existingUser = await User.findOne({ username })
  if (existingUser && !existingUser._id.equals(req.userId)) throw new AppError('USERNAME_NOT_AVAILABLE', 400)

  //check for duplicate social links urls
  if (hasDuplicate(socialLinks.map(l => l.url))) throw new AppError('Duplicate url in social links', 400)

  user.username = username
  user.specification = specification
  user.socialLinks = socialLinks

  //save user
  await user.save()

  res.json({ message: 'Profile edited succesfully' })
}

export const deleteProfile = async (req, res) => {
  //authorize
  const user = await User.findById(req.userId)
  if (!user._id.equals(req.userId)) throw new AppError('Not authorized', 403)

  //delete tracks
  const tracks = await Track.find({ author: req.userId })
  const unverifiedTracks = await UnverifiedTrack.find({ author: req.userId })

  const allTracks = tracks.concat(unverifiedTracks)

  for (const track of allTracks) {
    if (track.audio?.filename) {
      await deleteFileFromS3(track.audio.filename)
    }
    if (track.image?.filename && track.image.filename !== 'rudimentary-image.png') {
      await deleteFileFromS3(track.image.filename)
    }
    await track.deleteOne()
  }

  //delete likes
  await Like.deleteMany({ userId: req.userId })

  //delete follows
  await Follow.deleteMany({ followerId: req.userId })
  await Follow.deleteMany({ followedId: req.userId })

  //delete profile image if not default
  if (user.image?.filename && user.image.filename !== 'rudimentary-image.png') {
    await deleteFileFromS3(user.image.filename)
  }

  //delete from featured profiles
  await FeaturedProfile.findOneAndDelete({ profileId: req.userId })

  //delete user
  await user.deleteOne()

  //clear auth cookie
  res.clearCookie('refreshToken')

  res.json({ message: 'Profile deleted successfully' })
}

export const uploadProfileImage = async (req, res) => {
  const user = await User.findById(req.userId)

  //authorize and validate
  if (!user._id.equals(req.userId)) throw new AppError('NOT_AUTHORIZED', 403)
  if (!req.file) throw new AppError('NO_IMAGE_FOUND', 400)

  const processedBuffer = await Sharp(req.file.buffer).resize(300, 300).toBuffer()

  const filename = await uploadFileToS3(processedBuffer)
  const color = await getAverageColor(processedBuffer)

  user.image = {
    filename,
    averageColor: color,
  }

  await user.save()

  res.json({ image: user.image })
}

//featured profiles
export const addFeaturedProfile = async (req, res) => {
  const { profileId, trackId, duration } = req.body

  if (!profileId || !trackId || !duration) {
    throw new AppError('MISSING_REQUIRED_FIELDS', 400)
  }

  // Verify that profile exists
  const profile = await User.findById(profileId)
  if (!profile) throw new AppError('PROFILE_NOT_FOUND', 404)

  // Check if this profile and track combination already exists
  const existingFeatured = await FeaturedProfile.findOne({ profileId })
  if (existingFeatured) throw new AppError('PROFILE_ALREADY_FEATURED', 400)

  // Verify that track exists
  const track = await Track.findById(trackId)
  if (!track) throw new AppError('TRACK_NOT_FOUND', 404)

  // Verify that track belongs to the profile
  if (!track.author.equals(profileId)) {
    throw new AppError('TRACK_DOES_NOT_BELONG_TO_PROFILE', 400)
  }

  // Calculate featuredUntil date based on duration
  let featuredUntil
  let isInfinite = false

  switch (duration) {
    case '1week':
      featuredUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      break
    case '1month':
      featuredUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      break
    case 'infinite':
      // For infinite, set a far future date (e.g., 100 years)
      featuredUntil = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000)
      isInfinite = true
      break
    default:
      throw new AppError('INVALID_DURATION', 400)
  }

  // Create new featured profile
  const featuredProfile = new FeaturedProfile({
    profileId,
    trackId,
    featuredUntil,
    isInfinite,
    addedBy: req.userId,
  })

  await featuredProfile.save()

  res.status(201).json({
    message: 'Profile featured successfully',
    featuredProfile,
  })
}

export const deleteFeaturedProfile = async (req, res) => {
  const { profileId, trackId } = req.body

  if (!profileId || !trackId) throw new AppError('MISSING_REQUIRED_FIELDS', 400)

  const featuredProfile = await FeaturedProfile.findOneAndDelete({
    profileId,
    trackId,
  })

  if (!featuredProfile) throw new AppError('FEATURED_PROFILE_NOT_FOUND', 404)

  res.json({ message: 'Profile removed from featured successfully' })
}

export const getFeaturedProfiles = async (req, res) => {
  const currentDate = new Date()

  // 1. Clean up expired featured profiles
  await FeaturedProfile.deleteMany({
    featuredUntil: { $lt: currentDate },
    isInfinite: { $ne: true },
  })

  // 2. Find all active featured profiles
  const count = await FeaturedProfile.countDocuments({
    featuredUntil: { $gte: currentDate },
  })

  // 3. Get 3 random profiles
  let featuredProfiles = []

  if (count > 0) {
    // If we have 3 or fewer profiles, return all of them
    if (count <= 3) {
      featuredProfiles = await FeaturedProfile.find({
        featuredUntil: { $gte: currentDate },
      })
    } else {
      // Use aggregation to get random documents
      featuredProfiles = await FeaturedProfile.aggregate([{ $match: { featuredUntil: { $gte: currentDate } } }, { $sample: { size: 3 } }])
    }

    // 4. Populate necessary data
    const populatedProfiles = await Promise.all(
      featuredProfiles.map(async featured => {
        // Get the full profile and track data
        const [profile, track] = await Promise.all([User.findById(featured.profileId), Track.findById(featured.trackId)])

        if (!profile || !track) {
          // Skip this entry if profile or track no longer exists
          return null
        }

        // Get signed URLs for images
        const formattedTrack = await formatTrackData(track)
        profile.image.url = await generateSignedUrl(profile.image.filename)

        return {
          _id: featured._id,
          profile: sanitizeProfile(profile),
          track: formattedTrack,
          featuredUntil: featured.featuredUntil,
        }
      })
    )

    // Filter out any null entries (where profile or track doesn't exist anymore)
    featuredProfiles = populatedProfiles.filter(profile => profile !== null)
  }

  res.json({ featuredProfiles })
}
