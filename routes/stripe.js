/** @format */

const router = require('express').Router()
const dotenv = require('dotenv').config()
const KEY = process.env.STRIPE_KEY
const stripe = require('stripe')(KEY)

router.post('/payment', (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: 'eur'
    },
    (stripeError, stripeResponse) => {
      if (stripeError) {
        res.status(500).json(stripeError)
      } else {
        res.status(200).json(stripeResponse)
      }
    }
  )
})

module.exports = router
