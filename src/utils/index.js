const jwt = require('jsonwebtoken')

// Function to generate OTP
function generateOTP() {
  let OTP = ''
  for (let i = 0; i < 6; i++) {
    OTP += Math.floor(Math.random() * 10)
  }
  return OTP
}

function generateToken(user) {
  const expiresIn = '1d' // Token expires in 1 day
  const payload = { user_id: user._id, email: user.email }
  const secret = process.env.JWT_SECRET
  const token = jwt.sign(payload, secret, { expiresIn })
  return token
}

const isEmptyField = (value) => {
  let str = String(value).match(/((\r\n|\n|\r)$)|(^(\r\n|\n|\r))|^\s*$/gm)
  return str !== null ? true : false
}

module.exports = {
  generateToken,
  generateOTP,
  isEmptyField,
}
