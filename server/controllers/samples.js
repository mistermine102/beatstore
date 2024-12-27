import Audio from '../classes/Audio.js'
import Price from '../classes/Price.js'
import isLiked from '../isLiked.js'
import Sample from '../models/Sample.js'
import Like from '../models/Like.js'
import AppError from '../classes/AppError.js'
import { validationResult } from 'express-validator'
import { generateSignedUrl, uploadFileToS3, deleteFileFromS3 } from '../s3.js'
import getAudioDuration from '../utils/getAudioDuration.js'
import Sharp from 'sharp'
import Mongoose from 'mongoose'
import { updateUploadsOnCreate, updateUploadsOnDelete } from '../updateAuthorUploads.js'
import { getAverageColor } from 'fast-average-color-node'

export const uploadSampleImage = async (req, res) => {
  const { id } = req.params

  if (!Mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid id', 400)
  }

  const sample = await Sample.findById(id)

  if (!sample) {
    throw new AppError('Cannot find a sample', 400)
  }

  if (!req.file) {
    sample.image = {
      filename: 'rudimentary-image.png',
    }
  } else {
    //process the image
    const processedBuffer = await Sharp(req.file.buffer).resize(300, 300).toBuffer()

    //upload image to s3
    const filename = await uploadFileToS3(processedBuffer)

    //generate average color for the background
    const color = await getAverageColor(processedBuffer)

    sample.image = {
      filename,
      averageColor: color,
    }
  }

  await sample.save()

  res.json({ sample })
}

export const getSingleSample = async (req, res) => {
  const { errors } = validationResult(req)

  if (errors && errors.length) {
    throw new AppError('Invalid input', 400, errors)
  }

  const { id } = req.params

  const sample = await Sample.findById(id).populate('author')
  const sampleDoc = sample._doc

  //attach audio url
  sampleDoc.audio.url = await generateSignedUrl(sample.audio.filename)

  if (sampleDoc.image) {
    sampleDoc.image.url = await generateSignedUrl(sample.image.filename)
  }

  //alter author data
  sampleDoc.author = {
    _id: sampleDoc.author._id,
    username: sampleDoc.author.username,
  }

  //determine wheter the sample is liked
  sampleDoc.isLiked = await isLiked(req, 'Sample', sample)

  res.json({
    sample: sampleDoc,
  })
}

export const getSamples = async (req, res) => {
  const page = parseInt(req.params.page)
  const ITEMS_PER_PAGE = 5
  let areMoreDocs = false

  const count = await Sample.countDocuments()

  if (count > page * ITEMS_PER_PAGE) {
    areMoreDocs = true
  }

  const samples = await Sample.find()
    .limit(ITEMS_PER_PAGE)
    .skip((page - 1) * ITEMS_PER_PAGE)
    .populate('author')

  const sampleDocs = []

  for (const sample of samples) {
    const sampleDoc = sample._doc

    sampleDoc.audio.url = await generateSignedUrl(sample.audio.filename)

    if (sampleDoc.image) {
      sampleDoc.image.url = await generateSignedUrl(sample.image.filename)
    }

    //transform author object
    sampleDoc.author = {
      _id: sampleDoc.author._id,
      username: sampleDoc.author.username,
    }

    sampleDoc.isLiked = await isLiked(req, 'Sample', sample)

    sampleDocs.push(sampleDoc)
  }

  res.json({ samples: sampleDocs, areMoreDocs })
}

export const uploadSample = async (req, res) => {
  const { errors } = validationResult(req)

  if (errors && errors.length) {
    throw new AppError('Invalid input', 400, errors)
  }

  //upload file to s3
  const filename = await uploadFileToS3(req.file)

  const { title, bpm, key, price: priceValue } = req.body

  const duration = Math.floor(await getAudioDuration(req.file.buffer))

  //create sample and save sample
  const audio = new Audio({
    filename,
    duration,
  })

  const price = new Price({
    value: priceValue,
    currency: 'USD',
  })

  const newSample = new Sample({
    title,
    bpm,
    key,
    audio,
    price,
    author: req.userId,
    trackType: 'Sample',
    totalLikes: 0,
    totalStreams: 0,
  })

  await newSample.save()

  //update user's uploads and recent upload
  await updateUploadsOnCreate(req.userId, 'Sample', newSample._id)

  //send response
  res.json({ newSample })
}

export const deleteSample = async (req, res) => {
  const { errors } = validationResult(req)

  if (errors && errors.length) {
    throw new AppError('Invalid input', 400, errors)
  }

  const { sampleId } = req.body

  const sample = await Sample.findById(sampleId)

  if (!sample.author.equals(req.userId)) {
    throw new AppError('Not authorized', 403)
  }

  //delete file from s3
  deleteFileFromS3(sample.audio.filename)

  //delete image from s3
  if (sample.image && sample.image.filename !== 'rudimentary-image.png') {
    await deleteFileFromS3(sample.image.filename)
  }

  //delete sample's likes
  await Like.deleteMany({ trackType: 'Sample', trackId: sampleId })

  //delete sample from database
  await sample.deleteOne()

  //update author's uploads
  await updateUploadsOnDelete(req.userId, 'Sample', sample._id)

  //send response
  res.json({ deletedSample: sample })
}
