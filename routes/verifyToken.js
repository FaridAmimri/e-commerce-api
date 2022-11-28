/** @format */

const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
  const authToken = req.headers.token // token is provide in the headers req (bearer token)
  if (authToken) {
    const token = authToken.split(' ')[1] // Take 2nd element of token value after "Bearer"
    jwt.verify(token, process.env.JWT_KEY, (error, user) => {
      if (error) res.status(403).json('Token is not valid !')
      req.user = user // Create user req and assign user data
      next() // Go to router fn
    })
  } else {
    return res.status(401).json('You are not authenticated !')
  }
}

function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next()
    } else {
      res.status(403).json('You are not authorized !')
    }
  })
}

function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    /* If User it self or Admin*/
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next()
    } else {
      res.status(403).json('You are not authorized !')
    }
  })
}

module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization
}
