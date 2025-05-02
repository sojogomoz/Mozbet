require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const africastalking = require('africastalking');

// Modelos
const User = require('./models/User');
const Bet = require('./models/Bets');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado com sucesso'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Inicializar Africa's Talking
const africaTalk = africastalking({
  apiKey: process.env.AFRICA_TALKING_API_KEY,
  username: process.env.AFRICA_TALKING_USERNAME
});
const sms = africaTalk.SMS;

// Rota principal
app.get('/', (req, res) => {
  res.send('Só Jogo Moz backend está online!');
});

// Rota ping (manter online)
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Enviar SMS
app.post('/send-sms', (req, res) => {
  const { to, message } = req.body;

  const options = {
    to: [to],
    message: message,
    from: 'Só Jogo Moz'
  };

  sms.send(options)
    .then(response => res.json({ success: true, response }))
    .catch(err => res.status(500).json({ success: false, error: err.message }));
});

// Registrar usuário
app.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email já existe' });
    }

    const user = new User({ nome, email, senha });
    await user.save();

    res.json({ success: true, message: 'Usuário registrado com sucesso!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Login de usuário
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.compareSenha(senha))) {
      return res.status(400).json({ success: false, message: 'Email ou senha incorretos' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Criar aposta
app.post('/bet', async (req, res) => {
  const { valor, escolha, token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const bet = new Bet({ userId, valor, escolha });
    await bet.save();

    res.json({ success: true, message: 'Aposta registrada!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Histórico de apostas
app.get('/bets', async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const bets = await Bet.find({ userId }).sort({ dataAposta: -1 });
    res.json({ success: true, bets });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Só Jogo Moz rodando na porta ${PORT}`);
});
