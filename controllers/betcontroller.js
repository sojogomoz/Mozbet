const Bet = require('../models/Bet');
const jwt = require('jsonwebtoken');

// Criar aposta
exports.createBet = async (req, res) => {
  const { valor, escolha, token } = req.body;

  try {
    // Verificar o token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Criar nova aposta
    const bet = new Bet({ userId, valor, escolha });
    await bet.save();

    res.json({ success: true, message: 'Aposta registrada!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Histórico de apostas
exports.getBets = async (req, res) => {
  const { token } = req.query;

  try {
    // Verificar o token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Buscar apostas do usuário
    const bets = await Bet.find({ userId }).sort({ dataAposta: -1 });
    res.json({ success: true, bets });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
