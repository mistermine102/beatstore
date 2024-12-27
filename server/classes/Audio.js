import formatDuration from '../utils/formatDuration.js'

class Audio {
  constructor({ filename, duration }) {
    this.filename = filename || ''

    const formattedDuration = formatDuration(duration)

    this.duration = {
      seconds: duration,
      formatted: formattedDuration,
    }
  }
}

export default Audio
