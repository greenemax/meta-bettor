const mongoose = require('mongoose')

const betSchema = new mongoose.Schema({
  gambler_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,

  },
  bet_amount: {
    type: String,

  },
  bet_description: {
    type: String,

  },
  bet_result: {
    type: String,

  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Bet', betSchema)
