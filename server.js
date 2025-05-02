const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User');  // Importando o modelo de usuário
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

// Rota de cadastro de usuário
app.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  
  try {
    // Verificar se o usuário já existe
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ success: false, message: 'Email já registrado' });
    }
    
    // Criando o novo usuário
    const user = new User({ nome, email, senha });
    await user.save();
    
    res.json({ success: true, message: 'Usuário registrado com sucesso!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Rota de login de usuário
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Email ou senha inválidos' });
    }
    
    const isMatch = await user.compareSenha(senha);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Email ou senha inválidos' });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Rota principal
app.get('/', (req, res) => {
  res.send('Só Jogo Moz backend está online!');
});

// Rota de Ping (para manter o site online)
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Porta dinâmica (necessária para funcionar no Glitch)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
