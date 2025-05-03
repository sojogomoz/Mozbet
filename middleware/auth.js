const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
  const token = req.body.token || req.query.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token inválido' });
  }
};

module.exports = autenticar;
