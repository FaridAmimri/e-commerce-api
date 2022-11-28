/** @format */

const router = require('express').Router()
const User = require('../models/User')
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
} = require('./verifyToken')

// UPDATE
router.put('/update/:id', verifyTokenAndAuthorization, async (req, res) => {
  // If password is being updated, encrypt it again
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.CRYPTOJS_SECRET
    ).toString()
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body // Take all in the body req and set it again
      },
      { new: true } // return updated user
    )
    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).json(error)
  }
})

// DELETE A USER (FOR AMDIN OR USER ITSELF)

router.delete('/delete/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    res.status(200).json(user.username + ' has been deleted !')
  } catch (error) {
    res.status(500).json(error)
  }
})

// GET ALL USERS (JUST FOR AMDIN)

router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json(error)
  }
})

// GET A USER (JUST FOR AMDIN)

router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const { password, ...others } = user._doc
    res.status(200).json(others)
  } catch (error) {
    res.status(500).json(error)
  }
})

// GET USERS STATISTICS (FOR ADMIN DASHBOARD)

router.get('/statistics', verifyTokenAndAdmin, async (req, res) => {
  const currentDate = new Date()
  const lastYear = new Date(
    currentDate.setFullYear(currentDate.getFullYear() - 1)
  ) // Returns the last year

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } }, // match users on the last year from today
      {
        $project: {
          month: { $month: '$createdAt' }
        }
      }, // Take month number inside "createdAt" and assign it to month
      {
        $group: {
          _id: '$month',
          total: { $sum: 1 }
        }
      } // Sum all registered users by month
    ])
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
