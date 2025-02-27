import dotenv from 'dotenv'
dotenv.config()
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.dreamhost.com',
  port: 465,
  auth: {
    user: 'noreply@wavsmarket.com',
    pass: 'pHcAh9m8Cqt7D4M',
  },
  secure: true,
})

export default transporter
