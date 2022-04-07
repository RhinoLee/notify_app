const jwt = require('jsonwebtoken');
const Crypto = require('crypto')
const dotenv = require('dotenv');
dotenv.config();

function randomString(size = 36) {  
  return Crypto
    .randomBytes(size)
    .toString('base64')
}

const tokenHandler = {
  createJWT: (payload) => {
    const token = jwt.sign({ payload }, process.env.JWT_SECRET)
    return token
  },
  verifyJWT: (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { user_platform_id } = decoded.payload
    return user_platform_id
  },
  createAdminToken: () => {
    const token = randomString()
    return token
  }
}

module.exports = tokenHandler