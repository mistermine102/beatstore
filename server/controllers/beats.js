import Beat from '../models/Beat.js'
import Like from '../models/Like.js'
import AppError from '../classes/AppError.js'
import Audio from '../classes/Audio.js'
import Price from '../classes/Price.js'
import { uploadFileToS3, deleteFileFromS3, generateSignedUrl } from '../s3.js'
import isLiked from '../isLiked.js'
import Sharp from 'sharp'
import Mongoose from 'mongoose'
import getAudioDuration from '../utils/getAudioDuration.js'
import { updateUploadsOnCreate, updateUploadsOnDelete } from '../updateAuthorUploads.js'
import { getAverageColor } from 'fast-average-color-node'

export const uploadBeatImage = async (req, res) => {
  const { id } = req.params

  if (!Mongoose.Types.ObjectId.isValid(id)) throw new AppError('INVALID_ID', 400)

  const beat = await Beat.findById(id)

  if (!beat) throw new AppError('TRACK_NOT_FOUND', 400)

  if (!req.file) {
    beat.image = {
      filename: 'rudimentary-image.png',
    }
  } else {
    //process the image
    const processedBuffer = await Sharp(req.file.buffer).resize(300, 300).toBuffer()

    //upload image to s3
    const filename = await uploadFileToS3(processedBuffer)

    //generate average color for the background
    const color = await getAverageColor(processedBuffer)

    beat.image = {
      filename,
      averageColor: color,
    }
  }

  await beat.save()

  res.json({ beat })
}

export const getSingleBeat = async (req, res) => {
  const { id } = req.params

  const beat = await Beat.findById(id).populate('author')
  const beatDoc = beat._doc

  //attach audio and image urls
  beatDoc.audio.url = await generateSignedUrl(beat.audio.filename)

  if (beatDoc.image) {
    beatDoc.image.url = await generateSignedUrl(beat.image.filename)
  }

  //alter author data
  beatDoc.author = {
    _id: beatDoc.author._id,
    username: beatDoc.author.username,
  }

  //determine wheter the beat is liked
  beatDoc.isLiked = await isLiked(req, 'beat', beat)

  res.json({
    beat: beatDoc,
  })
}

export const getBeats = async (req, res) => {
  const beats = await Beat.find().populate('author')

  const beatsDocs = []

  for (const beat of beats) {
    const beatDoc = beat._doc

    beatDoc.audio.url = await generateSignedUrl(beat.audio.filename)

    if (beatDoc.image) {
      beatDoc.image.url = await generateSignedUrl(beat.image.filename)
    }

    //transform author object
    beatDoc.author = {
      _id: beatDoc.author._id,
      username: beatDoc.author.username,
    }

    beatDoc.isLiked = await isLiked(req, 'beat', beat)

    beatsDocs.push(beatDoc)
  }

  res.json({ beats: beatsDocs })
}

export const uploadBeat = async (req, res) => {
  //upload file to s3
  const filename = await uploadFileToS3(req.file)

  const { title, bpm, key, genre, price: priceValue } = req.body

  const duration = Math.floor(await getAudioDuration(req.file.buffer))

  //create beat and save beat
  const audio = new Audio({
    filename,
    duration,
  })

  const price = new Price({
    value: priceValue,
    currency: 'USD',
  })

  const newBeat = new Beat({
    title,
    bpm,
    key,
    genre,
    audio,
    price,
    author: req.userId,
    type: 'beat',
    totalLikes: 0,
    totalStreams: 0,
    playable: true
  })

  await newBeat.save()

  //update user's uploads and recent upload
  await updateUploadsOnCreate(req.userId, 'beat', newBeat._id)

  //send response
  res.json({ newBeat })
}

export const deleteBeat = async (req, res) => {
  const { beatId } = req.body
  
  if (!Mongoose.Types.ObjectId.isValid(beatId)) throw new AppError('INVALID_ID', 400)

  const beat = await Beat.findById(beatId)

  if (!beat) throw new AppError('TRACK_NOT_FOUND')

  if (!beat.author.equals(req.userId)) {
    throw new AppError('NOT_AUTHORIZED', 403)
  }

  //delete file from s3
  await deleteFileFromS3(beat.audio.filename)

  //delete image from s3
  if (beat.image && beat.image.filename !== 'rudimentary-image.png') {
    await deleteFileFromS3(beat.image.filename)
  }

  //delete beat's likes
  await Like.deleteMany({ trackType: 'beat', trackId: beatId })

  //delete beat from database
  await beat.deleteOne()

  //update author's uploads
  await updateUploadsOnDelete(req.userId, 'beat', beat._id)

  //send response
  res.json({ deletedBeat: beat })
}

export const updateBeat = async (req, res) => {
  //audioUrl is sent from the client so there is no need to genereate new one
  const { _id, title, bpm, key, genre, audioUrl } = req.body

  const beat = await Beat.findById(_id)

  //authorize
  if (!beat.author.equals(req.userId)) {
    throw new AppError('NOT_AUTHORIZED', 403)
  }

  beat.title = title
  beat.bpm = bpm
  beat.key = key
  beat.genre = genre

  beat.save()

  //reatach audio url beacuse it is not stored in the database
  //"updatedBeat" is an object from database
  beat.audio.url = audioUrl

  res.json({ beat })
}
