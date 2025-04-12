import dotenv from 'dotenv'
dotenv.config()

import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import generateRandomFilename from './utils/generateRandomFilename.js'

export const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
  },
})

 
export const uploadFileToS3 = async file => {
  const filename = generateRandomFilename()

  const command = new PutObjectCommand({
    Bucket: process.env.S3_NAME,
    Key: filename,
    Body: file.buffer,
    ContentType: file.mimetype,
  })

  await s3.send(command)

  return filename
}

export const deleteFileFromS3 = async filename => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_NAME,
    Key: filename,
  })

  await s3.send(command)
}

export const generateSignedUrl = async filename => {
  //generate signed url
  const command = new GetObjectCommand({
    Bucket: process.env.S3_NAME,
    Key: filename,
  })

  const url = await getSignedUrl(s3, command, { expiresIn: process.env.GET_AUDIO_EXPIRES_IN })
  return url
}
