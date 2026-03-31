const express = require('express');
const cors = require('cors');
require('dotenv').config();

const toursRoutes = require('./routes/tours');
const bookingsRoutes = require('./routes/bookings');
const usersRoutes = require('./routes/users');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/tours', toursRoutes);
app.use('/bookings', bookingsRoutes);
app.use('/users', usersRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});