const { google } = require('googleapis')
const nodemailer = require('nodemailer')

/*POPULATE BELOW FIELDS WITH YOUR CREDETIALS*/

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI
const MY_EMAIL = process.env.GMAIL_ADDRESS

/*POPULATE ABOVE FIELDS WITH YOUR CREDETIALS*/

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
)

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

//YOU CAN PASS MORE ARGUMENTS TO THIS FUNCTION LIKE CC, TEMPLATES, ATTACHMENTS ETC. IM JUST KEEPING IT SIMPLE
const sendSignupOtp = async (to, otp) => {
  const ACCESS_TOKEN = await oAuth2Client.getAccessToken()
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: MY_EMAIL,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: ACCESS_TOKEN,
    },
    tls: {
      rejectUnauthorized: true,
    },
  })

  //EMAIL OPTIONS
  const from = MY_EMAIL
  const subject = 'Verification OTP for Ukiyo'

  const html = `<body style="margin: 0">
    <div style="background-color: #f7f5f9;padding: 1%">
      <div
        style="
          background-color: #fff;
          margin: auto;
          padding: 3.5%;
          width: 70%;
          font-family: sans-serif;
        "
      >
        <img
          src=""
          alt=""
          width="50%"
          style="margin-left: -1.75%"
        />
        <hr />
        <h2 style="background: #90EE90; color: white; padding: 3%">
          E-mail Verification Code or OTP
        </h2>
        <div style="padding: 0 3%">
          <p>
            Hi, <br />
            <br />You requested for E-mail verification code to join Ukiyo.<br />Use the below OTP to verify your E-mail.
          </p>
          <div style="text-align: center">
            <h2>${otp}</h2>
            <p>This code is valid for 10 minutes and can be used only once.</p>
          </div>
          <br />
          <p>
            See you soon,<br />
            Ukiyo team
          </p>
        </div>
        <hr />
        <p style="padding: 0 3%">
        <font style="font-size:80%">
          This is an automatically generated email, please do not reply. Visit
          <a style="color: #017698" href="">
            Ukiyo </a
          >or E-mail us at
          <a style="color: #017698" href="help@ukiyo.com"
            >help@ukiyo.com</a
          >
          </font>
        </p>
        <div
          style="
            background-color: #90EE90;
            padding: 1%;
            color: #fff;
            text-align: center;
          "
        >
         <p style="padding: 0 2%">
          @Ukiyo
  	</p>
        </div>
      </div>
    </div>
  </body>`

  return new Promise((resolve, reject) => {
    transport.sendMail({ from, subject, to, html }, (err, info) => {
      if (err) reject(err)
      resolve(info)
    })
  })
}

module.exports = { sendSignupOtp }
