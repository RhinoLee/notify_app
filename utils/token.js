const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const tokenHandler = {
  createJWT: (payload) => {
    const token = jwt.sign({ payload }, process.env.JWT_SECRET)
    return token
  },
  verifyJWT: (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { user_platform_id } = decoded.payload
    return user_platform_id
  }
}

module.exports = tokenHandler