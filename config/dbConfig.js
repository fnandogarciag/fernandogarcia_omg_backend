const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

mongoose.set('strictQuery', true);
const dbUrl = process.env.MONGODB_URI;
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', () => {
  console.log('could not connect');
});
db.once('open', () => {
  console.log('Successfully connected to database');
});

const connectDB = (app) => {
  app.use(
    session({
      secret: process.env.secretOrKey,
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 60 * 60 * 24,
      }),
    })
  );
};

module.exports = connectDB;
