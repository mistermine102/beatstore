import decodeAudio from 'audio-decode' // For decoding audio into PCM data

/**
 * Parses an audio buffer into PCM data.
 * @param {Buffer} audioBuffer - The audio file buffer.
 * @returns {Promise<Float32Array>} - The decoded PCM data.
 */
async function parseAudioBuffer(audioBuffer) {
  try {
    // Decode and extract PCM data from audio
    const decodedAudio = await decodeAudio(audioBuffer)
    // Access the PCM data for the first channel (left in stereo, or the only one in mono)
    return decodedAudio.getChannelData(0)
  } catch (err) {
    throw new Error('Failed to parse audio buffer: ' + err.message)
  }
}

/**
 * Extracts waveform data from PCM data.
 * @param {Float32Array} pcmData - PCM data from the audio file.
 * @param {number} [samples=2000] - Number of samples to extract.
 * @param {number} [gain=1] - Value to amplify the signal by
 * @returns {Array<number>} - Normalized waveform data.
 */
function extractWaveformData(pcmData, samples = 2000, gain = 1) {
  const blockSize = Math.floor(pcmData.length / samples) // Size of each sample block
  const waveform = []

  for (let i = 0; i < samples; i++) {
    const start = i * blockSize
    const end = start + blockSize
    const block = pcmData.slice(start, end)

    // Calculate RMS of the block
    const rms = Math.sqrt(block.reduce((sum, value) => sum + value * value, 0) / block.length)

    // Amplify and store the RMS value
    waveform.push(rms * gain)
  }

  return waveform
}

/**
 * Main function to process an audio buffer and return a SoundCloud-style waveform SVG.
 * @param {Buffer} audioBuffer - The audio file buffer.
 * @param {Object} [options] - Options for the waveform generation.
 * @returns {Promise<Buffer>} - A buffer containing the waveform SVG.
 */
async function getWaveformSamples(audioBuffer) {
  // Parse the audio buffer to extract PCM data
  const pcmData = await parseAudioBuffer(audioBuffer)

  // Extract waveform data
  const waveformData = extractWaveformData(pcmData)
  return waveformData
}

export default getWaveformSamples
