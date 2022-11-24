/** @format */

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRoute = require('./routes/user')

dotenv.config()

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('DB Connection Successfull!'))
  .catch((error) => {
    console.log(error)
  })

app.use('/api/user', userRoute)

app.listen(process.env.PORT || 3000, () => {
  console.log('Backend server is running')
})
