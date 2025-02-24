import { parseBuffer } from 'music-metadata'

export async function getAudioDurationInSeconds(buffer) {
  const metadata = await parseBuffer(buffer)
  return metadata.format.duration
}

export function formatDuration(durationInSeconds) {
  let minutes = Math.floor(durationInSeconds / 60)
  let seconds = (durationInSeconds % 60).toFixed(0)

  if (!minutes) return seconds + 's'
  return minutes + 'm ' + seconds + 's'
}

export async function getAudioDurationObject(buffer) {
  const durationInSeconds = await getAudioDurationInSeconds(buffer)
  const formattedDuration = formatDuration(durationInSeconds)

  return {
    seconds: durationInSeconds,
    formatted: formattedDuration,
  }
}
