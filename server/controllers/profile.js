import User from '../models/User.js'
import AppError from '../classes/AppError.js'
import Follow from '../models/Follow.js'
import Sharp from 'sharp'
import { getAverageColor } from 'fast-average-color-node'
import { uploadFileToS3, generateSignedUrl } from '../s3.js'

export const getSingleProfile = async (req, res) => {
  const { profileId: userId } = req.params

  const user = await User.findById(userId).select('createdAt username _id totalFollows totalUploads specification image')
  if (!user) throw new AppError('USER_NOT_FOUND', 400)

  const formattedProfile = { ...user._doc }

  //determine if a profile is followed by a user
  formattedProfile.isFollowed = false

  if (req.isAuthenticated) {
    const followId = 'Follower' + req.userId + 'Followed' + userId
    const follow = await Follow.findById(followId)
    if (follow) formattedProfile.isFollowed = true
  }

  //attach profile image url
  formattedProfile.image.url = await generateSignedUrl(user.image.filename)

  res.json({ profile: formattedProfile })
}

export const toggleFollow = async (req, res) => {
  const followerId = req.userId
  const followedId = req.params.profileId

  const followedUser = await User.findById(followedId)
  if (!followedUser) throw new AppError('USER_NOT_FOUND', 400)

  //determine wheter we follow or unfollow
  const followId = 'Follower' + followerId + 'Followed' + followedId
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
  if (!user._id.equals(req.userId)) {
    throw new AppError('Not authorized', 403)
  }

  //edit user
  const { username, specification } = req.body

  user.username = username
  user.specification = specification

  //save user
  await user.save()

  res.json({ username, specification })
}

export const uploadProfileImage = async (req, res) => {
  const user = await User.findById(req.userId)

  //authorize
  if (!user._id.equals(req.userId)) {
    throw new AppError('Not authorized', 403)
  }

  //check for image
  if (!req.file) {
    throw new AppError('No image found', 400)
  }

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
