const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { checkAuth } = require('../middleware/checkAuth');
const User = require('../models/UserModel');

// Crear una nueva cuenta de usuario
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: 'El correo electrónico ya existe' });
    }
  } catch (error) {
    res.status(400).send(error);
  }
  const newUser = new User({
    name,
    email,
    password,
  });
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, async (err, hash) => {
      if (err) throw err;
      newUser.password = hash;

      try {
        await newUser.save();
        res.json(newUser);
      } catch (error) {
        res.status(400).send(error);
      }
    });
  });
});

// Inicio de sesión de usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'El usuario no existe' });
    }

    // Validar la contraseña
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) {
        return res.status(400).json({ msg: 'Contraseña incorrecta' });
      }
      req.session.userId = user._id;
      const token = jwt.sign(
        { userId: req.session.userId },
        process.env.secretOrKey,
        {
          expiresIn: '1h',
        }
      );
      res.json({ token });
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Ruta protegida
router.get('/protected', checkAuth, (req, res) => {
  res.json({ login: true, user: req.session.user });
});

// Ruta para desloguearse
router.post('/logout', checkAuth, (req, res) => {
  req.session.destroy();
  res.json({ message: 'Usuario deslogueado' });
});

module.exports = router;
