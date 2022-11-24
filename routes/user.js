/** @format */

const router = require('express').Router()

router.get('/usertest', (req, res) => {
  res.send('user test is succesfull')
})

module.exports = router
