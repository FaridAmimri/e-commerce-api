/** @format */

const router = require('express').Router()
const Order = require('../models/Order')
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
} = require('./verifyToken')

// CREATE
router.post('/', verifyToken, async (req, res) => {
  const newOrder = new Order(req.body)
  try {
    const savedOrder = await newOrder.save()
    res.status(200).json(savedOrder)
  } catch (error) {
    res.status(500).json(error)
  }
})

// UPDATE
router.put('/update/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body // Take all in the body req and set it again
      },
      { new: true } // return updated Order
    )
    res.status(200).json(updatedOrder)
  } catch (error) {
    res.status(500).json(error)
  }
})

// DELETE
router.delete('/delete/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id)
    res.status(200).json('Order has been deleted !')
  } catch (error) {
    res.status(500).json(error)
  }
})

// GET All Orders
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json(error)
  }
})

// GET User Orders
router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json(error)
  }
})

// GET Monthly Income
router.get('/income', verifyTokenAndAdmin, async (req, res) => {
  const productId = req.query.productid
  const currentDate = new Date()
  const lastMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1))
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1))

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
          ...(productId && {
            products: { $elemMatch: { productId: productId } }
          })
        }
      },
      {
        $project: {
          month: { $month: '$createdAt' },
          sales: '$amount'
        }
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: '$sales' }
        }
      }
    ])
    res.status(200).json(income)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
