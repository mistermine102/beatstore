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

function getComplementaryColor(hex: string): string {
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

  // Calculate the complementary color
  const compR = 255 - r
  const compG = 255 - g
  const compB = 255 - b

  // Convert back to hex and pad with zeros if necessary
  const toHex = (num: number): string => num.toString(16).padStart(2, '0')
  return `#${toHex(compR)}${toHex(compG)}${toHex(compB)}`
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
  const LIGHTEN_FACTOR = 1.3

  // Darker version of original color
  const waveformColor = adjustBrightness(hex, DARKEN_FACTOR)

  // Complementary color
  const complementaryColor = getComplementaryColor(hex)

  // Darker or lighter version of complementary
  const isDark = parseInt(complementaryColor.slice(1, 3), 16) < 128 // Check darkness by red component
  const highlightColor = adjustBrightness(complementaryColor, isDark ? LIGHTEN_FACTOR : DARKEN_FACTOR)

  return {
    waveformColor,
    progressColor: complementaryColor,
    highlightColor,
  }
}

export default getWaveformColors