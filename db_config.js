const mongoose = require('mongoose')

mongoose
  .connect(process.env.DB_URL)
  .then(async (data) => {
    console.log(`Mongodb connected with server: ${data.connection.host}`)
  })
  .catch((err) => console.log(err))
