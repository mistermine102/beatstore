import { generateSignedUrl } from '../s3.js'

export default async track => {
  const formattedTrack = { ...track._doc }

  //attach image url
  formattedTrack.image.url = await generateSignedUrl(formattedTrack.image.filename)

  // Attach audio URL if the track has an audio field
  if (formattedTrack.audio) {
    formattedTrack.audio = {
      ...formattedTrack.audio._doc,
      url: await generateSignedUrl(formattedTrack.audio.filename),
    }
  }

  return formattedTrack
}
