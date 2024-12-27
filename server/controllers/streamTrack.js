export const streamTrack = async (req, res) => {
  const { track } = req

  track.totalStreams++

  await track.save()

  res.json({ streams: track.totalStreams })
}
