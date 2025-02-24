import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import Track from './models/Track.js'
import User from './models/User.js'
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

const AUTHOR = '67b8aef37fbb24cd3ae56b33'

const BEATS = [
  {
    audio: {
      path: './_dummyData/dummyBeats/acid.wav',
      filename: '4a6196cee08264e4aa0a910cda83deafafb645499e05786177da5327bdca278d',
    },
    image: {
      path: './_dummyData/dummyImages/acid.png',
      filename: 'b66e1f0f70b5a3e1de37510557eb611c2e4ee8e216f59c0ca350920b827f9ae7',
    },
  },
  {
    audio: {
      path: './_dummyData/dummyBeats/ciekawe3.wav',
      filename: 'd23fe52c7b72faf242bba6091bb27b10d5f8de11c06530c20802168759aa6c56',
    },
    image: {
      path: './_dummyData/dummyImages/ciekawe3.png',
      filename: 'ea15fbebf2dab65b5387f1aae33ee3e0a6bc5b5a6c456d178d8c67172d0dc033',
    },
  },
  {
    audio: {
      path: './_dummyData/dummyBeats/grave.wav',
      filename: '13e908bb19c065e5d8e320fb4eb22ee9d56b0d5cec468f1d46badebdb8f8ec16',
    },
    image: {
      path: './_dummyData/dummyImages/grave.png',
      filename: 'd5deb6b581b960e83d34a1614968ca6a5ff97937009cbad969e4e8520b8ccf5e',
    },
  },
  {
    audio: {
      path: './_dummyData/dummyBeats/synthmadness.wav',
      filename: '8cf94b242b102988f12b9a77a6f3385a7b59bdf69ed743cd373c180a3936d652',
    },
    image: {
      path: './_dummyData/dummyImages/synthmadness.png',
      filename: '270a8a79b26d6e77a5f5a7f4d1d4fe3e4130e89eb147908f1820ce3916b1b161',
    },
  },
  {
    audio: {
      path: './_dummyData/dummyBeats/what.wav',
      filename: '75550a4209ae7c225736382437ec50faa7d0095b5c133ec77adc79194f070357',
    },
    image: {
      path: './_dummyData/dummyImages/what.png',
      filename: '39713d5fa82874c78907778a8fa0fd4a0c4dc053357977a9086983064e1d7929',
    },
  },
]

const getRandomTrackData = tracks => tracks[Math.floor(Math.random() * tracks.length)]
const getRandomBpm = () => Math.floor(Math.random() * 101) + 90
const getRandomKey = () => KEYS[Math.floor(Math.random() * KEYS.length)]
const getRandomGenre = () => GENRES[Math.floor(Math.random() * GENRES.length)]

const addDummyTracks = async () => {
  await Track.deleteMany()
  console.log('Deleted tracks')

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
      author: AUTHOR,
      bpm: getRandomBpm(),
      key: getRandomKey(),
      genre: getRandomGenre(),
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
