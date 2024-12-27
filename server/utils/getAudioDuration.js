import { parseBuffer } from 'music-metadata'

export default async function (buffer) {
  const metadata = await parseBuffer(buffer)
  return metadata.format.duration
}
