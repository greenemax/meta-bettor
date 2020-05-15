const mongoose = require('mongoose')

const betSchema = new mongoose.Schema({
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
