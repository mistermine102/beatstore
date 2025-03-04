function adjustBrightness(hex: string, factor: number): string {
  // Remove the '#' if present
  hex = hex.replace(/^#/, '')

  // Expand shorthand notation (e.g., "abc" -> "aabbcc")
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(char => char + char)
      .join('')
  }

  // Parse the hex color into RGB components
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)

  // Adjust brightness
  const adjust = (value: number): number => Math.max(0, Math.min(255, Math.round(value * factor)))

  const adjustedR = adjust(r)
  const adjustedG = adjust(g)
  const adjustedB = adjust(b)

  // Convert back to hex and pad with zeros if necessary
  const toHex = (num: number): string => num.toString(16).padStart(2, '0')
  return `#${toHex(adjustedR)}${toHex(adjustedG)}${toHex(adjustedB)}`
}

function getWaveformColors(hex: string): {
  waveformColor: string
  progressColor: string
  highlightColor: string
} {
  if (!/^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/.test(hex)) {
    throw new Error('Invalid hex color format')
  }

  const DARKEN_FACTOR = 0.7

  // Grey base for waveform
  const waveformColor = '#2a2a2a'
  
  // Original color for progress
  const progressColor = hex
  
  // Darker version of average color for highlight
  const highlightColor = adjustBrightness(hex, DARKEN_FACTOR)

  return {
    waveformColor,
    progressColor,
    highlightColor,
  }
}

export default getWaveformColors