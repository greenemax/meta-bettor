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

// Index: GET /bets return all the bets
router.get('/bets', (req, res) => {
  // get the bets from the database
  Bet.find()
    .populate('gambler_id')
    .then((bets) => res.json({ bets: bets }))
    .catch(console.error)
})

// Create: POST /books save the book data
router.post('/bets', (req, res, next) => {
  // get book data from request
  const bet = req.body.bet
  // save book to mongodb
  Bet.create(bet)
    // if successful respond with 201 and book json
    .then(bet => res.status(201).json({ bet: bet.toObject() }))
    // on error respond with 500 and error message
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

// Show: GET /bets/:id return the bet
router.get('/bets/:id', (req, res) => {
  const id = req.params.id
  Bet.findById(id)
    .populate('gambler_id')
    // handle 404 error if no book found
    .then(handle404)
    // respond with json of the book
    // use mongoose toObject on book to include virtuals
    .then(bet => res.json({ bet: bet.toObject() }))
    .catch(console.error)
})

// Destroy: DELETE /books/:id delete the book
router.delete('/bets/:id', (req, res) => {
  const id = req.params.id
  Bet.findById(id)
    .then(bet => bet.deleteOne())
    .then(() => res.sendStatus(204))
    .catch(console.error)
})

module.exports = router
