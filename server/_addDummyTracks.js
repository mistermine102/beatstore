import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import Track from './models/Track.js'
import User from './models/User.js'
import License from './models/License.js'
import fs from 'fs/promises'
import getWaveformSamples from './utils/getWaveformSamples.js'
import { getAudioDurationObject } from './utils/audioDuration.js'
import { getAverageColor } from 'fast-average-color-node'

const GENRES = ['Trap', 'BoomBap', 'Rage', 'Drill', 'Hip Hop', 'Pop', 'Rock', 'Jazz', 'Classical', 'Electronic', 'House', 'Techno']
const KEYS = [
  'A Minor',
  'A# Minor',
  'B Minor',
  'C Minor',
  'C# Minor',
  'D Minor',
  'D# Minor',
  'E Minor',
  'F Minor',
  'F# Minor',
  'G Minor',
  'G# Minor',
  'A Major',
  'A# Major',
  'B Major',
  'C Major',
  'C# Major',
  'D Major',
  'D# Major',
  'E Major',
  'F Major',
  'F# Major',
  'G Major',
  'G# Major',
]

const BEATS = [
  {
    audio: {
      path: './_dummyData/dummyBeats/acid.wav',
      filename: 'acid.wav',
    },
    image: {
      path: './_dummyData/dummyImages/acid.png',
      filename: 'acid.png',
    },
  },
  {
    audio: {
      path: './_dummyData/dummyBeats/ciekawe3.wav',
      filename: 'ciekawe3.wav',
    },
    image: {
      path: './_dummyData/dummyImages/ciekawe3.png',
      filename: 'ciekawe3.png',
    },
  },
  {
    audio: {
      path: './_dummyData/dummyBeats/grave.wav',
      filename: 'grave.wav',
    },
    image: {
      path: './_dummyData/dummyImages/grave.png',
      filename: 'grave.png',
    },
  },
  {
    audio: {
      path: './_dummyData/dummyBeats/synthmadness.wav',
      filename: 'synthmadness.wav',
    },
    image: {
      path: './_dummyData/dummyImages/synthmadness.png',
      filename: 'synthmadness.png',
    },
  },
  {
    audio: {
      path: './_dummyData/dummyBeats/what.wav',
      filename: 'what.wav',
    },
    image: {
      path: './_dummyData/dummyImages/what.png',
      filename: 'what.png',
    },
  },
]

const getRandomTrackData = tracks => tracks[Math.floor(Math.random() * tracks.length)]
const getRandomBpm = () => Math.floor(Math.random() * 101) + 90
const getRandomKey = () => KEYS[Math.floor(Math.random() * KEYS.length)]
const getRandomGenre = () => GENRES[Math.floor(Math.random() * GENRES.length)]

const getRandomPrice = () => {
  const factor = Math.random()

  if (factor > 0.3) {
    return Math.floor(Math.random() * 6000) + 2000
  }

  return 0
}

const addDummyTracks = async () => {
  await Track.deleteMany()
  console.log('Deleted tracks')

  const AUTHOR = (await User.findOne({ roles: 'admin' }))._id
  const LICENSE = await License.findById('1')

  const NUM_OF_TRACKS = 10

  const tracksDocs = []

  for (let i = 0; i < NUM_OF_TRACKS; i++) {
    const randomBeatData = getRandomTrackData(BEATS)

    const audioBuffer = await fs.readFile(randomBeatData.audio.path)
    const imageBuffer = await fs.readFile(randomBeatData.image.path)

    const duration = await getAudioDurationObject(audioBuffer)
    const waveformSamples = await getWaveformSamples(audioBuffer)
    const averageColor = await getAverageColor(imageBuffer)

    const beat = new Track({
      title: `Beat ${i + 1}`,
      type: 'beat',
      audio: {
        filename: randomBeatData.audio.filename,
        waveform: { samples: waveformSamples },
        duration,
      },
      image: {
        filename: randomBeatData.image.filename,
        averageColor,
      },
      price: {
        unitAmount: getRandomPrice(),
        currency: 'USD',
      },
      author: AUTHOR,
      bpm: getRandomBpm(),
      key: getRandomKey(),
      genre: getRandomGenre(),
      instruments: [],
      mood: '',
      license: LICENSE,
      playable: true,
      totalLikes: 0,
      totalStreams: 0,
      verified: true,
    })
    tracksDocs.push(beat)
  }

  for (let i = 0; i < NUM_OF_TRACKS; i++) {
    const randomBeatData = getRandomTrackData(BEATS)

    const audioBuffer = await fs.readFile(randomBeatData.audio.path)
    const imageBuffer = await fs.readFile(randomBeatData.image.path)

    const duration = await getAudioDurationObject(audioBuffer)
    const waveformSamples = await getWaveformSamples(audioBuffer)
    const averageColor = await getAverageColor(imageBuffer)

    const sample = new Track({
      title: `Sample ${i + 1}`,
      type: 'sample',
      audio: {
        filename: randomBeatData.audio.filename,
        waveform: { samples: waveformSamples },
        duration,
      },
      image: {
        filename: randomBeatData.image.filename,
        averageColor,
      },
      author: AUTHOR,
      bpm: getRandomBpm(),
      key: getRandomKey(),
      instruments: [],
      mood: '',
      price: {
        unitAmount: getRandomPrice(),
        currency: 'USD',
      },
      license: LICENSE,
      playable: true,
      totalLikes: 0,
      totalStreams: 0,
      verified: true,
    })
    tracksDocs.push(sample)
  }

  Track.insertMany(tracksDocs)
  console.log('Added new tracks')
}

mongoose
  .connect(process.env.DB_URI)
  .then(addDummyTracks)
  .catch(err => console.log("Can't connect to database", err))
