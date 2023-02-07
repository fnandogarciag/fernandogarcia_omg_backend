const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const checkAuth = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({
      login: false,
      message: 'No se proporcionó un token de autorización',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.secretOrKey);
    req.session.userId = decoded.userId;
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.session.destroy();
      return res
        .status(404)
        .json({ login: false, message: 'El usuario no existe' });
    }
    req.session.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      login: false,
      message: 'Token de autorización inválido',
    });
  }
};

module.exports = { checkAuth };
