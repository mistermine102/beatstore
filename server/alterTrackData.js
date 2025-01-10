import { generateSignedUrl } from './s3.js'

export default async track => {
  const newTrack = {
    ...track._doc,
  }

  //attach audio url
  if (track.playable) {
    const audioUrl = await generateSignedUrl(track.audio.filename)

    newTrack.audio = {
      ...track._doc.audio,
      url: audioUrl,
    }
  }

  //attach image url
  if (track.image) {
    newTrack.image = {
      ...track._doc.image,
      url: await generateSignedUrl(track.image.filename),
    }
  }

  //alter author data
  newTrack.author = {
    username: track._doc.author._doc.username,
    _id: track._doc.author._doc._id,
  }

  return newTrack
}
