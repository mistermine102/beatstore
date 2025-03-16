import License from '../models/License.js'

export const getLicenses = async (req, res) => {
  const licenses = await License.find()
  res.json({ licenses })
}
