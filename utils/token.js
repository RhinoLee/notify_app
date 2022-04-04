const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const tokenHandler = {
  createJWT: (payload) => {
    const token = jwt.sign({ payload }, process.env.JWT_SECRET)
    return token
  }
}

module.exports = tokenHandler