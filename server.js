require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const africastalking = require('africastalking');

// Modelos
const User = require('./models/User');
const Bet = require('./models/Bets');

// Controladores
const userController = require('./controllers/userController');
const betController = require('./controllers/betController');

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

// Rotas de usuário
app.post('/register', userController.register);
app.post('/login', userController.login);

// Rotas de aposta
app.post('/bet', betController.createBet);
app.get('/bets', betController.getBets);

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Só Jogo Moz rodando na porta ${PORT}`);
});
