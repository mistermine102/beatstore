import User from '../models/User.js'
import alterTrackData from '../alterTrackData.js'
import AppError from '../classes/AppError.js'
import Follow from '../models/Follow.js'
import Mongoose from 'mongoose'
import Sharp from 'sharp'
import { getAverageColor } from 'fast-average-color-node'
import { uploadFileToS3, generateSignedUrl } from '../s3.js'
import isLiked from '../isLiked.js'

export const getProfile = async (req, res) => {
  const { id: userId } = req.params
  if (!Mongoose.Types.ObjectId.isValid(userId)) throw new AppError('INVALID_ID', 400)

  const user = await User.findById(userId).populate({
    path: 'uploads.trackId',
    populate: 'author',
  })
  if (!user) throw new AppError('USER_NOT_FOUND', 400)

  const { createdAt, uploads, username, _id, totalFollows, totalUploads, specification, image } = user._doc

  //modify uploads
  const modifiedUploads = []

  for (const track of uploads) {
    const modifiedUpload = await alterTrackData(track.trackId)
    modifiedUpload.isLiked = await isLiked(req, track.trackId.type, track.trackId)

    modifiedUploads.push(modifiedUpload)
  }

  //determine wheter profile is followed
  let isFollowed = false

  if (!req.isAuthenticated) {
    isFollowed = false
  } else {
    //userId (not req.userId) is a profile's id in this case
    const index = 'Follower' + req.userId + 'Followed' + userId
    const follow = await Follow.findOne({ index })

    if (!follow) {
      isFollowed = false
    } else {
      isFollowed = true
    }
  }

  let modifiedImage = {}

  if (image) {
    const imageUrl = await generateSignedUrl(image.filename)

    //get profile's image
    modifiedImage = {
      ...image,
      url: imageUrl,
    }
  }

  const userDoc = {
    createdAt,
    uploads: modifiedUploads,
    username,
    _id,
    isFollowed,
    totalFollows,
    totalUploads,
    specification,
    image: modifiedImage,
  }

  res.send({ profile: userDoc })
}

export const toggleFollow = async (req, res) => {
  const followerId = req.userId
  const followedId = req.params.id
  if (!Mongoose.Types.ObjectId.isValid(followedId)) throw new AppError('Invalid followed id', 400)
  if (!Mongoose.Types.ObjectId.isValid(followerId)) throw new AppError('Invalid follower id', 400)

  const followedUser = await User.findById(followedId)
  if (!followedUser) throw new AppError('Cannot find a followed user', 400)

  //determine wheter we follow or unfollow
  const index = 'Follower' + followerId + 'Followed' + followedId
  const follow = await Follow.findOne({ index })

  if (!follow) {
    //increment followed user follows
    followedUser.totalFollows++

    //create new follow
    const newFollow = new Follow({
      index,
      followerId,
      followedId,
      createdAt: new Date(),
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
