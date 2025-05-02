const mongoose = require('mongoose');

const BetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  valor: {
    type: Number,
    required: true
  },
  escolha: {
    type: String,
    enum: ['cara', 'coroa'],
    required: true
  },
  dataAposta: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bet', BetSchema);
