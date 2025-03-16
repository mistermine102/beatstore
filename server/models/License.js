import mongoose from 'mongoose'
import { Schema } from 'mongoose'

export const licenseSchema = new Schema({
  _id: String,
  title: String,
  shortDescription: String,
  longDescription: String
})

const License = mongoose.model('license', licenseSchema)

export default License
