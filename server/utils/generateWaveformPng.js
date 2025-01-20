import decodeAudio from 'audio-decode' // For decoding audio into PCM data
import { createCanvas } from 'canvas' // For drawing the waveform
import sharp from 'sharp' // For generating PNG image

/**
 * Parses an audio buffer into PCM data.
 * @param {Buffer} audioBuffer - The audio file buffer.
 * @returns {Promise<Float32Array>} - The decoded PCM data.
 */
async function parseAudioBuffer(audioBuffer) {
  try {
    const decodedAudio = await decodeAudio(audioBuffer)
    return decodedAudio.getChannelData(0) // Use the first channel
  } catch (err) {
    throw new Error('Failed to parse audio buffer: ' + err.message)
  }
}

/**
 * Extracts waveform data from PCM data.
 * @param {Float32Array} pcmData - PCM data from the audio file.
 * @param {number} [samples=2000] - Number of samples to extract.
 * @returns {Array<number>} - Normalized waveform data.
 */
function extractWaveformData(pcmData, samples = 2000) {
  const blockSize = Math.floor(pcmData.length / samples) // Size of each sample block
  const waveform = []

  for (let i = 0; i < samples; i++) {
    const start = i * blockSize
    const end = start + blockSize
    const block = pcmData.slice(start, end)
    const blockMax = Math.max(...block)
    const blockMin = Math.min(...block)
    waveform.push((blockMax - blockMin) / 2) // Calculate amplitude
  }

  return waveform
}

/**
 * Generates a SoundCloud-style waveform PNG image.
 * @param {Array<number>} waveformData - Normalized waveform data.
 * @param {number} [width=800] - Width of the image.
 * @param {number} [height=200] - Height of the image.
 * @param {Object} [options={}] - Customization options.
 * @param {string} [options.barColor='black'] - Color of the waveform bars.
 * @param {string} [options.bgColor='transparent'] - Background color of the image.
 * @param {number} [options.barWidth=2] - Width of each bar in the waveform.
 * @param {number} [options.barSpacing=1] - Space between bars.
 * @returns {Promise<Buffer>} - A buffer containing the PNG image.
 */
async function generateWaveformPng(waveformData, width = 800, height = 200, options = {}) {
  const { barColor = 'white', bgColor = 'transparent', barWidth = 2, barSpacing = 1 } = options

  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // Background color
  if (bgColor !== 'transparent') {
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, width, height)
  }

  const totalBars = Math.floor(width / (barWidth + barSpacing))
  const midline = height / 2

  // Scale the waveform data to match the number of bars
  const scaleFactor = waveformData.length / totalBars
  const scaledData = Array.from({ length: totalBars }, (_, i) =>
    Math.max(...waveformData.slice(Math.floor(i * scaleFactor), Math.floor((i + 1) * scaleFactor)))
  )

  // Draw bars
  ctx.fillStyle = barColor
  scaledData.forEach((amplitude, index) => {
    const x = index * (barWidth + barSpacing)
    const barHeight = amplitude * height
    const y = midline - barHeight / 2

    ctx.fillRect(x, y, barWidth, barHeight)
  })

  // Convert the canvas to a PNG buffer
  return sharp(canvas.toBuffer()).toFormat('png').toBuffer()
}

/**
 * Main function to process an audio buffer and return a SoundCloud-style waveform PNG.
 * @param {Buffer} audioBuffer - The audio file buffer.
 * @param {Object} [options] - Options for the waveform generation.
 * @returns {Promise<Buffer>} - A buffer containing the waveform PNG.
 */
async function processAudioToWaveformPng(audioBuffer, options) {
  // Parse the audio buffer to extract PCM data
  const pcmData = await parseAudioBuffer(audioBuffer)

  // Extract waveform data
  const waveformData = extractWaveformData(pcmData)

  // Generate and return the waveform PNG
  return generateWaveformPng(waveformData, 800, 200, options)
}

export default processAudioToWaveformPng
