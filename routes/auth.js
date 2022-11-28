/** @format */

const router = require('express').Router()
const User = require('../models/User')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

// REGISTER

router.post('/register', async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.CRYPTOJS_SECRET.toString() // Encrypt password using CryptoJS
    )
  })

  try {
    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (error) {
    res.status(500).json(error)
  }
})

// LOGIN

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }) // Find user in the DB by his username
    !user && res.status(401).json('Wrong credentials!')

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.CRYPTOJS_SECRET
    ) // Decrypt user password

    const decryptedPassword = hashedPassword.toString(CryptoJS.enc.Utf8) // Convert encoded password to string

    decryptedPassword !== req.body.password &&
      res.status(401).json('Wrong credentials!')

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin
      },
      process.env.JWT_KEY,
      { expiresIn: '3d' }
    )

    const { password, ...others } = user._doc

    res.status(200).json({ ...others, accessToken }) // Returns all user data (except password) and add accessToken
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
