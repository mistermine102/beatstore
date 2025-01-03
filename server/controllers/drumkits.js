import Drumkit from '../models/Drumkit.js'
import Audio from '../classes/Audio.js'
import Price from '../classes/Price.js'
import Mongoose from 'mongoose'
import { uploadFileToS3, generateSignedUrl } from '../s3.js'
import { validationResult } from 'express-validator'
import AppError from '../classes/AppError.js'
import isLiked from '../isLiked.js'
import Sharp from 'sharp'
import { getAverageColor } from 'fast-average-color-node'

function isDirectoryTitleAvailable(directories, directoryTitle) {
  const foundDirectory = directories.find(dir => dir.title === directoryTitle)
  if (foundDirectory) return false

  return true
}

function isDrumTitleAvailable(drums, drumTitle) {
  const foundDrum = drums.find(dr => dr.title === drumTitle)
  if (foundDrum) return false

  return true
}

export const getSingleDrumkit = async (req, res) => {
  const { id } = req.params

  const drumkit = await Drumkit.findById(id).populate('author')
  const drumkitDoc = drumkit._doc

  for (const directory of drumkitDoc.directories) {
    for (const drum of directory.drums) {
      //attach audio url to every drum
      drum.audio.url = await generateSignedUrl(drum.audio.filename)
    }
  }

  if (drumkitDoc.image) {
    drumkitDoc.image.url = await generateSignedUrl(drumkit.image.filename)
  }

  //alter author data
  drumkitDoc.author = {
    _id: drumkitDoc.author._id,
    username: drumkitDoc.author.username,
  }

  //determine wheter the beat is liked
  drumkitDoc.isLiked = await isLiked(req, 'Drumkit', drumkit)

  res.json({
    drumkit: drumkitDoc,
  })
}

export const getDrumkits = async (req, res) => {
  const drumkits = await Drumkit.find().populate('author')
  const drumkitDocs = []

  for (const drumkit of drumkits) {
    const drumkitDoc = drumkit._doc

    for (const directory of drumkit._doc.directories) {
      for (const drum of directory.drums) {
        //attach audio url to every drum
        drum.audio.url = await generateSignedUrl(drum.audio.filename)
      }
    }

    if (drumkitDoc.image) {
      drumkitDoc.image.url = await generateSignedUrl(drumkit.image.filename)
    }

    drumkitDoc.author = {
      _id: drumkitDoc.author._id,
      username: drumkitDoc.author.username,
    }

    drumkitDoc.isLiked = await isLiked(req, 'Drumkit', drumkit)

    drumkitDocs.push(drumkitDoc)
  }

  res.json({ drumkits })
}

export const uploadDrumkitImage = async (req, res) => {
  const { id } = req.params

  if (!Mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid id', 400)
  }

  const drumkit = await Drumkit.findById(id)

  if (!drumkit) {
    throw new AppError('Cannot find a drumkit', 400)
  }

  if (!req.file) {
    drumkit.image = {
      filename: 'rudimentary-image.png',
    }
  } else {
    //process the image
    const processedBuffer = await Sharp(req.file.buffer).resize(300, 300).toBuffer()

    //upload image to s3
    const filename = await uploadFileToS3(processedBuffer)

    //generate average color for the background
    const color = await getAverageColor(processedBuffer)

    drumkit.image = {
      filename,
      averageColor: color,
    }
  }

  await drumkit.save()

  res.json({ drumkit })
}

export const uploadDrumkit = async (req, res) => {
  if (!req.body.drumkit || !req.files) {
    throw new AppError('Invalid data', 400)
  }

  //create drum kit
  const { title, price: priceValue, directories } = req.body.drumkit
  const newDirectories = []

  for (const directory of directories) {
    //make sure there are no directories with the same title
    if (!isDirectoryTitleAvailable(newDirectories, directory.title)) {
      throw new AppError('Detected directory duplicate', 400)
    }

    newDirectories.push({
      title: directory.title,
      drums: [],
    })

    for (const drum of directory.drums) {
      const currentDirectory = newDirectories.find(dir => dir.title === directory.title)

      //make sure there are no drums with the same title in the same directory
      if (!isDrumTitleAvailable(currentDirectory.drums, drum.title)) {
        throw new AppError('Detected drum duplicate', 400)
      }

      //find a file associated with that drum
      const drumFilename = `dir-${directory.title}-drum-${drum.title}`
      const foundDrumfile = req.files.find(file => file.originalname === drumFilename)

      if (!foundDrumfile) {
        throw new AppError('Missing drum file', 400)
      }

      // upload drum audio to s3
      const filename = await uploadFileToS3(foundDrumfile)

      const audio = new Audio({
        filename,
        duration: 0,
      })

      currentDirectory.drums.push({
        title: drum.title,
        type: drum.type,
        audio,
      })
    }
  }

  const price = new Price({
    value: priceValue,
    currency: 'USD',
  })

  const newDrumkit = new Drumkit({
    title,
    price,
    directories: newDirectories,
    author: req.userId,
    type: 'Drumkit',
    totalLikes: 0,
    playable: false
  })

  await newDrumkit.save()

  res.send({ drumkit: newDrumkit })
}
