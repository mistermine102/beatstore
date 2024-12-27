import crypto from 'crypto'

export default (bytes = 32) => crypto.randomBytes(bytes).toString('hex')
