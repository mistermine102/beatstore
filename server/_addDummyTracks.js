import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import Track from './models/Track.js'
import User from './models/User.js'

const GENRES = ['Trap', 'R&B', 'Drill', 'Rage', 'Boombap']

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

const addDummyTracks = async () => {
  await Track.deleteMany()
  console.log('removed tracks')

  const docs = []

  let bpm, genre, key

  const waveformSamples = []

  while (waveformSamples.length < 2000) {
    waveformSamples.push(Math.random() * (Math.random() > 0.5 ? 0.8 : 0.5)) // Random fluctuation
  }

  for (let i = 0; i < 50; i++) {
    bpm = Math.floor(Math.random() * 100) + 90
    genre = GENRES[Math.floor(Math.random() * GENRES.length)]
    key = KEYS[Math.floor(Math.random() * KEYS.length)]

    const newBeat = new Track({
      title: 'Beat ' + i,
      type: 'beat',
      image: {
        filename: 'rudimentary-image.png',
      },
      audio: {
        filename: '3df0731f4eaddb2b7179e89f50f424a9a890c36a701445625fb152213bbf5d3d',
        duration: {
          seconds: 69,
          formatted: '1m 9s',
        },
        waveform: {
          samples: waveformSamples,
        },
      },
      author: '6772fc0631d11efd2fe7f72f',
      bpm,
      key,
      genre,
      playable: true,
      totalLikes: 0,
      totalStreams: 0,
    })

    bpm = Math.floor(Math.random() * 100) + 90
    key = KEYS[Math.floor(Math.random() * KEYS.length)]

    const newSample = new Track({
      title: 'Sample ' + i,
      type: 'sample',
      image: {
        filename: 'rudimentary-image.png',
      },
      audio: {
        filename: '3df0731f4eaddb2b7179e89f50f424a9a890c36a701445625fb152213bbf5d3d',
        duration: {
          seconds: 69,
          formatted: '1m 9s',
        },
        waveform: {
          samples: waveformSamples,
        },
      },
      author: '6772fc0631d11efd2fe7f72f',
      bpm,
      key,
      playable: true,
      totalLikes: 0,
      totalStreams: 0,
    })

    docs.push(newBeat, newSample)
  }

  //update author uploads
  const author = await User.findById('6772fc0631d11efd2fe7f72f')

  author.uploads.push(...docs.map(el => el._id))
  author.totalUploads += 100

  await author.save()

  await Track.insertMany(docs)
  console.log('added new tracks')
}

mongoose
  .connect(process.env.DB_URI)
  .then(() => addDummyTracks())
  .catch(err => console.log("Can't connect to database", err))
