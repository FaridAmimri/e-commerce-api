/** @format */

const router = require('express').Router()
const Cart = require('../models/Cart')
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
} = require('./verifyToken')

// CREATE
router.post('/', verifyToken, async (req, res) => {
  const newCart = new Cart(req.body)
  try {
    const savedCart = await newCart.save()
    res.status(200).json(savedCart)
  } catch (error) {
    res.status(500).json(error)
  }
})

// UPDATE
router.put('/update/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body // Take all in the body req and set it again
      },
      { new: true } // return updated Cart
    )
    res.status(200).json(updatedCart)
  } catch (error) {
    res.status(500).json(error)
  }
})

// DELETE
router.delete('/delete/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id)
    res.status(200).json('Cart has been deleted !')
  } catch (error) {
    res.status(500).json(error)
  }
})

// GET All
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find()
    res.status(200).json(carts)
  } catch (error) {
    res.status(500).json(error)
  }
})

// GET User Cart
router.get('/find/:userId', async (req, res) => {
  try {
    const Cart = await Cart.findOne({ userId: req.params.userId })
    res.status(200).json(Cart)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
