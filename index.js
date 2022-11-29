/** @format */

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')

dotenv.config() // can not use dotenv without this fn

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('DB Connection Successfull!'))
  .catch((error) => {
    console.log(error)
  })

// API Routes
app.use(express.json()) // Allow json file
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/products', productRoute)
app.use('/api/carts', cartRoute)
app.use('/api/orders', orderRoute)

// If there is no PORT number in env file, use 3000 PORT
app.listen(process.env.PORT || 3000, () => {
  console.log('Backend server is running')
})
