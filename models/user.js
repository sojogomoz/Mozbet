const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Definindo o esquema do usuário
const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  dataRegistro: { type: Date, default: Date.now },
});

// Encriptando a senha antes de salvar o usuário
userSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  this.senha = await bcrypt.hash(this.senha, 10);
  next();
});

// Comparando senha
userSchema.methods.compareSenha = function(senha) {
  return bcrypt.compare(senha, this.senha);
};

module.exports = mongoose.model('User', userSchema);
