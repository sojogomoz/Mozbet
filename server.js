require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const africastalking = require('africastalking');

// Inicializando o app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado com sucesso'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Inicializando a API do Africa's Talking
const africaTalk = africastalking({
  apiKey: process.env.AFRICA_TALKING_API_KEY,
  username: process.env.AFRICA_TALKING_USERNAME
});

// Configuração do serviço de SMS
const sms = africaTalk.SMS;

// Rota de envio de SMS
app.post('/send-sms', (req, res) => {
  const { to, message } = req.body;

  const options = {
    to: [to],
    message: message,
    from: 'Só Jogo Moz'  // Nome do remetente
  };

  sms.send(options)
    .then(response => {
      res.json({ success: true, response });
    })
    .catch(err => {
      res.status(500).json({ success: false, error: err.message });
    });
});

// Rota principal
app.get('/', (req, res) => {
  res.send('Só Jogo Moz backend está online!');
});

// Rota de Ping (para manter o site online)
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Geração do token JWT (exemplo de login)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Aqui você deve verificar o usuário no banco de dados
  // Para fins de exemplo, vamos considerar um usuário simples:
  const user = { username: 'alex', password: 'senha' };

  if (username === user.username && password === user.password) {
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Credenciais inválidas' });
  }
});

// Porta dinâmica (necessária para funcionar no Glitch)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
