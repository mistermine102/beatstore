import User from './models/User.js'

export const updateUploadsOnCreate = async (userId, trackType, modelName, trackId) => {
  const author = await User.findById(userId)

  author.uploads.push({
    createdAt: new Date(),
    trackType,
    modelName,
    trackId,
  })

  author.totalUploads++

  await author.save()
}

export const updateUploadsOnDelete = async (userId, trackType, trackId) => {
  const author = await User.findById(userId)

  author.uploads = author.uploads.filter(track => !(track.trackId.equals(trackId) && track.trackType === trackType))
  author.totalUploads--

  await author.save()
}
