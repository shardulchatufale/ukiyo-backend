const router = require('express').Router()
const auth = require('../controller/auth.controller')
const { check } = require('express-validator')

// for signing up a user and sending an OTP
router.post(
  '/signup',
  [check('email').isEmail(), check('phone').isLength({ min: 10 })],
  auth.signup,
)


module.exports = router
