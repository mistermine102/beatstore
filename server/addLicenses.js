import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import License from './models/License.js'

const licenses = [
  {
    _id: '1',
    title: 'Universal Free License',
    shortDescription: 'Free for all uses without restrictions',
    longDescription:
      'This content is available for anyone to download, use, modify, and include in any project, whether personal or commercial. No attribution is required, and no payment is needed under any circumstances. Users may freely incorporate this content into their own projects without any restrictions.',
  },
  {
    _id: '2',
    title: 'Personal Use Only',
    shortDescription: 'Free for personal projects; contact creator for commercial use',
    longDescription:
      'This content is free to use in personal, non-commercial projects only. For any commercial use (projects intended for monetary gain or business purposes), you must contact the creator directly to discuss permission and terms before using the content. Commercial rights are not automatically granted by downloading.',
  },
]

async function addLicenses() {
  await License.deleteMany()
  console.log('Licenses removed')

  for (const license of licenses) {
    const newLicense = new License(license)
    await newLicense.save()
  }
  console.log('Licenses added')
}

mongoose
  .connect(process.env.DB_URI)
  .then(addLicenses)
  .catch(err => console.log("Can't connect to database", err))
