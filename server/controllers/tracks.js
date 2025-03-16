import Track, { UnverifiedTrack } from '../models/Track.js'
import AppError from '../classes/AppError.js'
import { uploadFileToS3, deleteFileFromS3 } from '../s3.js'
import User from '../models/User.js'
import Like from '../models/Like.js'
import checkUserInteraction from '../utils/checkUserInteraction.js'
import Sharp from 'sharp'
import { getAverageColor } from 'fast-average-color-node'
import formatTrackData from '../utils/formatTrackData.js'
import getWaveformSamples from '../utils/getWaveformSamples.js'
import formatComments from '../utils/formatComments.js'
import { getAudioDurationObject } from '../utils/audioDuration.js'
import License from '../models/License.js'
import { sendTrackLikedEmail, sendTrackPendingEmail } from '../emails/emails.js'

const UPLOAD_SCHEMAS = {
  beat: {
    title: '',
    type: 'beat',
    description: '',
    audio: null,
    key: '',
    genre: '',
    mood: '',
    instruments: [],
    bpm: '',
    totalLikes: 0,
    totalStreams: 0,
    playable: true,
  },
  sample: {
    title: '',
    type: 'sample',
    description: '',
    audio: null,
    key: '',
    bpm: '',
    mood: '',
    instruments: [],
    totalLikes: 0,
    totalStreams: 0,
    playable: true,
  },
  drumkit: {
    title: '',
    type: 'drumkit',
    description: '',
  },
  loop: {
    title: '',
    type: 'loop',
    description: '',
    audio: null,
    key: '',
    bpm: '',
    mood: '',
    instruments: [],
    totalLikes: 0,
    totalStreams: 0,
    playable: true,
  },
}

const FILTER_SCHEMAS = {
  beat: {
    bpm: 'range',
    key: 'set',
    genre: 'set',
    mood: 'set',
    instruments: 'set',
  },
  sample: {
    bpm: 'range',
    key: 'set',
    mood: 'set',
    instruments: 'set',
  },
  drumkit: {},
  loop: {
    bpm: 'range',
    key: 'set',
    mood: 'set',
    instruments: 'set',
  },
  all: {
    bpm: 'range',
    key: 'set',
    genre: 'set',
    mood: 'set',
    instruments: 'set',
  },
}

export const uploadTrack = async (req, res) => {
  const { type } = req.body

  if (type === 'drumkit') throw new AppError('Drumkits not available yet', 400)

  const uploadSchema = UPLOAD_SCHEMAS[type]
  const newTrack = new UnverifiedTrack()

  //attach fields that exists in schema to the new track
  //basically it creates new Track based on a given uploadSchema (UPLOAD_SCHEMAS are defines above)
  //it adds fields associated with a given track type
  //we can later check if a field exists on a track and execute needed code
  for (const schemaKey of Object.keys(uploadSchema)) {
    newTrack[schemaKey] = req.body[schemaKey] ? req.body[schemaKey] : uploadSchema[schemaKey]
  }

  //attach author
  newTrack.author = req.userId

  //process audio
  if (uploadSchema.audio !== undefined) {
    // if schema contains audio field then it is required
    if (!req.file) throw new AppError('AUDIO_IS_REQUIRED', 400)

    const filename = await uploadFileToS3(req.file)
    const duration = getAudioDurationObject(req.file.buffer)
    const waveformSamples = await getWaveformSamples(req.file.buffer)

    newTrack.audio = {
      filename,
      waveform: { samples: waveformSamples },
      duration,
    }
  }

  //attach license
  const license = await License.findById(req.body.licenseId)
  if (!license) throw new AppError('LICENSE_NOT_FOUND', 404)
  newTrack.license = license

  //save a track
  await newTrack.save()

  //send email to admins that track is waiting for verification
  await sendTrackPendingEmail()

  //send response
  res.json({ trackId: newTrack._id })
}

export const uploadTrackImage = async (req, res) => {
  const { trackId } = req.params

  if (!req.file) throw new AppError('IMAGE_IS_REQUIRED')

  const verfiedTrack = await Track.findById(trackId)
  const unverifiedTrack = await UnverifiedTrack.findById(trackId)

  const track = verfiedTrack ? verfiedTrack : unverifiedTrack

  if (!track) throw new AppError('TRACK_NOT_FOUND', 404)

  // Process the uploaded image (resize, compress, etc.)
  const processedBuffer = await Sharp(req.file.buffer).resize(300, 300).toBuffer()

  // Upload image to S3
  const filename = await uploadFileToS3(processedBuffer)

  // Generate average color for UI purposes
  const color = await getAverageColor(processedBuffer)

  // Update the track's image field
  track.image = {
    filename,
    averageColor: color,
  }

  // Save changes to the database
  await track.save()

  // Respond with the updated track image
  res.json({ trackId: track._id })
}

export const deleteTrack = async (req, res) => {
  const { trackId } = req.params

  const track = await Track.findById(trackId)

  if (!track) throw new AppError('TRACK_NOT_FOUND', 400)

  if (!track.author.equals(req.userId)) throw new AppError('NOT_AUTHORIZED', 403)

  //delete file from s3
  await deleteFileFromS3(track.audio.filename)

  //delete image from s3
  if (track.image.filename !== 'rudimentary-image.png') {
    await deleteFileFromS3(track.image.filename)
  }

  //delete beat's likes
  await Like.deleteMany({ trackId })

  //delete beat from database
  await track.deleteOne()

  //update author's uploads
  const author = await User.findById(req.userId)

  author.uploads = author.uploads.filter(trackId => !trackId.equals(track._id))
  author.totalUploads--

  await author.save()

  //send response
  res.json({ track })
}

export const getTracks = async (req, res) => {
  const { type } = req.params // Validated 'type'
  const start = parseInt(req.query.start) || 0 // Defaults to 0 if not provided
  const amount = parseInt(req.query.amount) || 10 // Defaults to 10 if not provided
  const { authorId, phrase, liked, unverified } = req.query

  const filterSchema = FILTER_SCHEMAS[type]
  let Model = Track
  const filter = {}

  if (authorId) filter.author = authorId

  if (liked) {
    if (!req.isAuthenticated) throw new AppError('NOT_AUTHENTICATED', 401)
    //find ids of tracks liked by a user and add them to the filter
    const likes = await Like.find({ userId: req.userId })
    const trackIds = likes.map(el => el.trackId)
    filter._id = { $in: trackIds }
  }

  if (unverified) {
    if (!req.isAuthenticated) throw new AppError('NOT_AUTHENTICATED', 401)
    filter.author = req.userId
    filter.verified = false
    Model = UnverifiedTrack
  }

  // Apply phrase-based search if 'phrase' is provided
  if (phrase) {
    const formattedPhrase = phrase.trim().toLowerCase()
    // Use $text search if available
    filter.$text = { $search: formattedPhrase }
  }

  //don't add type filter if querying for all tracks
  if (type !== 'all') filter.type = type

  //create a filter object based on available filters for each track type and filters sent in query
  //key here refers to the object key, not key as a track property
  for (const [key, value] of Object.entries(filterSchema)) {
    switch (value) {
      case 'exact':
        if (req.query[key] !== undefined) filter[key] = req.query[key]
        break
      case 'set':
        if (req.query[key] !== undefined) {
          // Split the values by commas and filter out any empty values
          const values = req.query[key]
            .split(',')
            .map(val => val.trim())
            .filter(Boolean)
          // Apply the filter using $in to match any of the provided values
          filter[key] = { $in: values }
        }
        break
      case 'range':
        if (req.query[key] !== undefined) {
          const parsedMin = parseInt(req.query[key].min)
          const parsedMax = parseInt(req.query[key].max)

          if (!isNaN(parsedMin) || !isNaN(parsedMax)) {
            filter[key] = {}
            if (!isNaN(parsedMin)) filter[key].$gte = parsedMin
            if (!isNaN(parsedMax)) filter[key].$lte = parsedMax
          }
        }
        break
    }
  }

  //only populate username on author
  const tracks = await Model.find(filter).sort({ createdAt: -1 }).skip(start).limit(amount).populate('author', 'username').populate({
    path: 'comments.author', // Populate the author field in comments
    select: 'username image', // Only select username and profilePic
  })
  const trackIds = tracks.map(el => el._id)

  //create an object where keys are trackIds and values are whether they're liked
  const likes = await checkUserInteraction(req, trackIds, 'track')

  //promise.all to process tracks in parallel
  const formattedTracks = await Promise.all(
    tracks.map(async track => {
      //attach audio and image url
      const formattedTrack = await formatTrackData(track)

      //determine wheter it's liked
      formattedTrack.isLiked = likes[track._id]

      //format the comments (exclude votes array and determine user current vote)
      formattedTrack.comments = await formatComments(formattedTrack.comments, req.userId)

      return formattedTrack
    })
  )

  // Check if there are more tracks available in the database
  const totalTracksCount = await Model.countDocuments(filter)
  const isMore = totalTracksCount > start + amount

  res.json({ tracks: formattedTracks, isMore })
}

export const getSingleTrack = async (req, res) => {
  const { trackId } = req.params

  // Find the track by ID and populate author details
  const track = await Track.findById(trackId)
    .populate('author', 'username') // Populate the track author's username
    .populate({
      path: 'comments.author', // Populate the author field in comments
      select: 'username image', // Only select username and profilePic
    })
  if (!track) throw new AppError('TRACK_NOT_FOUND', 404)

  const formattedTrack = await formatTrackData(track)

  // Determine whether the track is liked by the user
  formattedTrack.isLiked = await checkUserInteraction(req, track._id, 'track')

  //format the comments (exclude votes array and determine user current vote)
  formattedTrack.comments = await formatComments(formattedTrack.comments, req.userId)

  // Respond with the track data
  res.json({
    track: formattedTrack,
  })
}

export const toggleTrackLike = async (req, res) => {
  const { trackId } = req.params

  const likeId = `User-${req.userId}Track-${trackId}`

  const foundLike = await Like.findById(likeId)
  const foundTrack = await Track.findById(trackId).populate('author', 'email')

  if (!foundLike) {
    foundTrack.totalLikes++

    //create new like
    const newLike = new Like({
      _id: likeId,
      trackId,
      userId: req.userId,
    })
    await newLike.save()

    //send email
    await sendTrackLikedEmail(foundTrack.author.email, foundTrack)
  } else {
    foundTrack.totalLikes--
    await foundLike.deleteOne()
  }

  await foundTrack.save()

  res.json({ action: foundLike ? 'Disliked' : 'Liked', trackId })
}

export const streamTrack = async (req, res) => {
  const track = await Track.findById(req.params.trackId)

  if (!track.playable) throw new AppError('TRACK_NOT_PLAYABLE', 400)

  track.totalStreams++

  await track.save()

  res.json({ trackId: track._id })
}
