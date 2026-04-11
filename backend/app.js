const express = require('express');
const cors = require('cors');
require('dotenv').config();

const toursRoutes = require('./routes/tours');
const usersRoutes = require('./routes/users');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/tours', toursRoutes);
app.use('/users', usersRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

module.exports = app;