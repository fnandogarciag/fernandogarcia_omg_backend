const express = require('express');

const authRouter = require('./authRouter');
const productsRouter = require('./productRouter');

const routerApi = (app) => {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/', authRouter);
  router.use('/products', productsRouter);
};

module.exports = routerApi;
