const { validationResult } = require('express-validator')
const { User } = require('../model/User')
const { sendResponse, sendError } = require('../utils/api-response')
const { generateOTP } = require('../utils')
const { sendSignupOtp } = require('../services/mailer')

/** POST /api/auth/signup */
exports.signup = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return sendError(res, errors.array(), 400, 'Validation Failed!')
    }

    const user = await User.findOne({ email: req.body.email })
    if (user && user.verified)
      return sendResponse(res, 409, 'User Already Exists!')

    // Generate OTP
    const otp = generateOTP()

    // Save the OTP and its expiry time to the database
    const currentTime = Date.now()
    const expiryTime = currentTime + 5 * 60 * 1000 // 5 minutes

    // If User exists but Email is not verified
    if (user && !user.verified) {
      user.first_name = req.body.first_name
      user.last_name = req.body.last_name
      user.email = req.body.email
      user.phone = req.body.phone
      user.otp = otp
      user.otp_for = 'signup'
      user.otp_expiry_time = expiryTime

      // Save user to the database
      const savedUser = await user.save()

      await sendSignupOtp(savedUser.email, otp)

      return sendResponse(res, 200, 'OTP sent to email!')
    }

    // Create a new User object
    const newUser = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone: req.body.phone,
      otp: otp,
      otp_for: 'signup',
      otp_expiry_time: expiryTime,
      is_onboarded: false,
      is_account_activated: false,
      profile_url: Math.floor(100000 + Math.random() * Date.now()) + Date.now(),
    })

    const validationError = newUser.validateSync()
    if (validationError) {
      console.error(validationError)
    } else {
      console.log('User is valid')
    }

    // Save user to the database
    const savedUser = await newUser.save()

    await sendSignupOtp(savedUser.email, otp)

    sendResponse(res, 200, 'OTP sent to email!')
  } catch (error) {
    sendError(res, error, 500, 'Internal Server Error!')
  }
}


