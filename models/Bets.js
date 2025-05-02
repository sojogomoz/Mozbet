const mongoose = require('mongoose');

// Definindo o esquema da aposta
const betSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  valor: { type: Number, required: true },
  escolha: { type: String, required: true },
  dataAposta: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bet', betSchema);
