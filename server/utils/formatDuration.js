export default function (durationInSeconds) {
  let minutes = Math.floor(durationInSeconds / 60)
  let seconds = (durationInSeconds % 60).toFixed(0)

  if (!minutes) {
    return seconds + 's'
  }

  return minutes + 'm ' + seconds + 's'
}
