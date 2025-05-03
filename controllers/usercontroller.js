const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Registrar usuário
exports.register = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    // Verificar se o usuário já existe
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email já existe' });
    }

    // Criar um novo usuário
    const user = new User({ nome, email, senha });
    await user.save();

    res.json({ success: true, message: 'Usuário registrado com sucesso!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Login de usuário
exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.compareSenha(senha))) {
      return res.status(400).json({ success: false, message: 'Email ou senha incorretos' });
    }

    // Gerar o token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
