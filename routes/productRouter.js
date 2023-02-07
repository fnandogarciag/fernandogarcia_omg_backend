/* eslint-disable no-unused-vars */
const express = require('express');
const { checkAuth } = require('../middleware/checkAuth');
const Product = require('../models/ProductModel');

const router = express.Router();
router.use(checkAuth);

// Obtener todos los productos
router.get('/', async (req, res) => {
  const products = await Product.find({ userId: req.session.userId });
  res.json(products);
});

// Crear un producto
router.post('/', async (req, res) => {
  const product = new Product({
    userId: req.session.userId,
    name: req.body.name,
    image: req.body.image,
    price: req.body.price,
    rate: req.body.rate,
  });
  try {
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    userId: req.session.userId,
  });
  if (!product) {
    return res.status(404).send('Producto no encontrado');
  }
  res.send(product);
});

// Actualizar un producto por ID
router.put('/:id', async (req, res) => {
  const product = await Product.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.session.userId,
    },
    req.body,
    { new: true }
  );
  if (!product) {
    return res.status(404).send('Producto no encontrado');
  }
  res.send(product);
});

// Eliminar un producto por ID
router.delete('/:id', async (req, res) => {
  const product = await Product.findOneAndDelete({
    _id: req.params.id,
    userId: req.session.userId,
  });
  if (!product) {
    return res.status(404).send('Producto no encontrado');
  }
  res.send({
    message: 'Producto eliminado',
  });
});

module.exports = router;
