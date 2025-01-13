import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import Track from './models/Track.js'

const addDummyTracks = async () => {
  await Track.deleteMany()
  console.log('removed tracks')

  const docs = []

  for (let i = 0; i < 2000; i++) {
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
      },
      author: '6772fc0631d11efd2fe7f72f',
      bpm: '166',
      key: 'A# Minor',
      genre: 'Trap',
      playable: true,
      totalLikes: 0,
      totalStreams: 0,
    })

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
      },
      author: '6772fc0631d11efd2fe7f72f',
      bpm: '166',
      key: 'A# Minor',
      playable: true,
      totalLikes: 0,
      totalStreams: 0,
    })

    const newDrumkit = new Track({
      title: 'Drumkit ' + i,
      type: 'drumkit',
      image: {
        filename: 'rudimentary-image.png',
      },
      author: '6772fc0631d11efd2fe7f72f',
      totalLikes: 0,
    })
    docs.push(newBeat, newSample, newDrumkit)
  }
  await Track.insertMany(docs)
  console.log('added new tracks')
}

mongoose
  .connect(process.env.DB_URI)
  .then(() => addDummyTracks())
  .catch(err => console.log("Can't connect to database", err))
