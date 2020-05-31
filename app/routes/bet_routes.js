// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for bets
const Bet = require('../models/bet')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// Create: POST /bet save the book data
router.post('/bets', requireToken, (req, res, next) => {
  // get bet data from request
  const betData = req.body.bet
  betData.gambler_id = req.user._id
  // save book to mongodb
  Bet.create(betData)
    // if successful respond with 201 and book json
    .then(bet => res.status(201).json({ bet: bet.toObject() }))
    // on error respond with 500 and error message
    .catch(next)
})

// INDEX
// GET /examples
router.get('/bets', requireToken, (req, res, next) => {
  Bet.find()
    .then(bets => {
      // `examples` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return bets.map(bet => bet.toObject())
    })
    // respond with status 200 and JSON of the examples
    .then(bets => res.status(200).json({ bets: bets }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /examples/5a7db6c74d55bc51bdf39793
router.get('/bets/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Bet.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "example" JSON
    .then(bet => res.status(200).json({ bet: bet.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// Destroy: DELETE /books/:id delete the book
router.delete('/bets/:id', (req, res, next) => {
  const id = req.params.id
  Bet.findById(id)
    .then(bet => bet.deleteOne())
    .then(() => res.sendStatus(204))
    .catch(next)
})

// Update: PATCH /books/:id delete the book
router.patch('/bets/:id', (req, res, next) => {
  // get id of book from params
  const id = req.params.id
  // get book data from request
  const betData = req.body.bet
  // fetching book by its id
  Bet.findById(id)
    // handle 404 error if no book found
    .then(handle404)
    // update book
    .then(bet => {
      // updating book object
      // with bookData
      Object.assign(bet, betData)
      // save book to mongodb
      return bet.save()
    })
    // if successful return 204
    .then(() => res.sendStatus(204))
    // on error go to next middleware
    .catch(next)
})

module.exports = router
