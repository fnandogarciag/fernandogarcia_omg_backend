require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

require('./config/dbConfig')(app);

app.get('/', (req, res) => {
  res.send('Hello World');
});
require('./routes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Servidor en ejecución en el puerto ${PORT}`)
);
