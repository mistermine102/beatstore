import path from 'path'
import { __dirname } from '../utils/pathUtils.js'
import transporter from '../emailTransporter.js'
import jwt from 'jsonwebtoken'
import ejs from 'ejs'

const NOREPLY_EMAIL = 'noreply@wavsmarket.com'
const ADMIN_ADDRESSES = ['szymonjarosz102@gmail.com']

export const sendVerifyEmail = async email => {
  //generate url with token
  const baseUrl = 'http://localhost:3000'
  const token = jwt.sign({ email }, process.env.JWT_EMAIL_SECRET, { expiresIn: 3600 })
  const link = `${baseUrl}/auth/verify/${token}`

  //get the template
  const template = await ejs.renderFile(path.join(__dirname, '../templates/userVerifyEmail.ejs'), { verificationLink: link })

  //send a confirmation email
  await transporter.sendMail({
    from: NOREPLY_EMAIL, // sender address
    to: email,
    subject: 'Verify your email address', // Subject line
    html: template, // html body
  })
}

export const sendTrackPendingEmail = async () => {
  await transporter.sendMail({
    from: NOREPLY_EMAIL,
    to: ADMIN_ADDRESSES,
    subject: 'Track is pending',
    html: 'Track is waiting for verification',
  })
}

export const sendTrackVerifiedEmail = async (email, track) => {
  const viewUploadLink = `http://localhost:5173/track/${track._id}`

  const template = await ejs.renderFile(path.join(__dirname, '../templates/trackVerifiedEmail.ejs'), { viewUploadLink, uploadTitle: track.title })

  await transporter.sendMail({
    from: NOREPLY_EMAIL,
    to: email,
    subject: 'Your upload just got verified!',
    html: template,
  })
}

export const sendTrackLikedEmail = async (email, track) => {
  const viewUploadLink = `http://localhost:5173/track/${track._id}`

  const template = await ejs.renderFile(path.join(__dirname, '../templates/trackLikedEmail.ejs'), { viewUploadLink, uploadTitle: track.title })

  await transporter.sendMail({
    from: NOREPLY_EMAIL,
    to: email,
    subject: 'Someone liked your upload!',
    html: template,
  })
}

export const sendTrackCommentedEmail = async (email, track) => {
  const viewUploadLink = `http://localhost:5173/track/${track._id}`

  const template = await ejs.renderFile(path.join(__dirname, '../templates/trackCommentedEmail.ejs'), { viewUploadLink, uploadTitle: track.title })

  await transporter.sendMail({
    from: NOREPLY_EMAIL,
    to: email,
    subject: 'Someone commented your upload!',
    html: template,
  })
}
