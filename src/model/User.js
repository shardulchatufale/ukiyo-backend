const mongoose = require('mongoose')
const gender = Object.freeze({
  MALE: 'male',
  FEMALE: 'female',
  NONE: null,
})


/** User Schema */
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true },
    verified: { type: Boolean, default: false },
    otp: { type: Number, default: null },
    otp_expiry_time: { type: Number, default: null },
    otp_for: {
      type: String,
      enum: ['signup', null],
      default: null,
    },

    is_onboarded: { type: Boolean, required: true, default: false },
    is_account_activated: { type: Boolean, required: true, default: false },

    first_name: { type: String, trim: true, default: null },
    last_name: { type: String, trim: true, default: null },
    profile_url: {
      type: String,
      trim: true,
      unique: true,
      default: null,
      lowercase: true,
    },
    gender: {
      type: String,
      enum: Object.values(gender),
      trim: true,
      default: null,
    },

    phone: { type: Number, default: null },
  },
  { timestamps: true },
)

module.exports = {
  User: mongoose.model('User', userSchema),
}
