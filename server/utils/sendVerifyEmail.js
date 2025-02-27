import jwt from 'jsonwebtoken'
import ejs from 'ejs'
import path from 'path'
import { __dirname } from '../utils/pathUtils.js'
import transporter from '../emailTransporter.js'

const sendVerifyEmail = async email => {
  //generate url with token
  const baseUrl = 'http://localhost:3000'
  const token = jwt.sign({ email }, process.env.JWT_EMAIL_SECRET, { expiresIn: 3600 })
  const link = `${baseUrl}/auth/verify/${token}`

  //get the template
  const template = await ejs.renderFile(path.join(__dirname, '../templates/userVerifyEmail.ejs'), { verificationLink: link })

  //send a confirmation email
  const result = await transporter.sendMail({
    from: 'noreply@wavsmarket.com', // sender address
    to: email,
    subject: `Zweryfikuj swój adres email`, // Subject line
    html: template, // html body
  })
  console.log(result)
}

export default sendVerifyEmail
