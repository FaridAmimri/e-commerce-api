/** @format */

const router = require('express').Router()
const Product = require('../models/Product')
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
} = require('./verifyToken')

// CREATE
router.post('/', verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body)
  try {
    const savedProduct = await newProduct.save()
    res.status(200).json(savedProduct)
  } catch (error) {
    res.status(500).json(error)
  }
})

// UPDATE
router.put('/update/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body // Take all in the body req and set it again
      },
      { new: true } // return updated product
    )
    res.status(200).json(updatedProduct)
  } catch (error) {
    res.status(500).json(error)
  }
})

// DELETE
router.delete('/delete/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.status(200).json('Product has been deleted !')
  } catch (error) {
    res.status(500).json(error)
  }
})

// GET ALL PRODUCTS
router.get('/', async (req, res) => {
  const queryNew = req.query.new
  const queryCategory = req.query.category

  try {
    let products
    if (queryNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5)
    } else if (queryCategory) {
      products = await Product.find({
        categories: {
          $in: [queryCategory]
        }
      })
    } else {
      products = await Product.find()
    }
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json(error)
  }
})

// GET A PRODUCT
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    res.status(200).json(product)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
