require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
require('./db_config')

const fs = require('fs')

// Middleware
app.use(cors())
app.use(helmet())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const accessLogStream = fs.createWriteStream(__dirname + '/.log', {
  flags: 'a',
})

// Use Morgan middleware to log HTTP requests to console and file
app.use(morgan('combined', { stream: accessLogStream }))

// Routes
app.get('/api', (req, res) => res.send("Hey, Ukiyo Backend is up and running. !!! :)"))

app.use('/api/auth', require('./src/router/auth.routes'))


const port = process.env.PORT || 5000
app.listen(port, function () {
  console.log('Server running on port: ' + port)
})
