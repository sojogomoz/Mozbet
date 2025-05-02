const express = require('express');
const router = express.Router();
const Bet = require('../models/Bets');
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Token ausente' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
};

router.post('/apostar', authMiddleware, async (req, res) => {
  try {
    const { valor, escolha } = req.body;
    const novaAposta = new Bet({ userId: req.userId, valor, escolha });
    await novaAposta.save();
    res.status(201).json({ message: 'Aposta registada com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao enviar aposta' });
  }
});

module.exports = router;
