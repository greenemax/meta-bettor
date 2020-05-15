const mongoose = require('mongoose')

const betSchema = new mongoose.Schema({
  gambler_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: String,
    required: true
  },
  bet_amount: {
    type: String,
    required: true
  },
  bet_description: {
    type: String,
    required: true
  },
  bet_result: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Bet', betSchema)
