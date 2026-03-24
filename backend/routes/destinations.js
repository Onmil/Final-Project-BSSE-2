// destination.js
const express = require('express');
const router = express.Router();

// Temporary/mock destinations data
let destinations = [
  { id: 1, name: "Baguio City", description: "Cool mountain city with scenic views.", price: 150 },
  { id: 2, name: "Boracay", description: "White sand beaches and crystal-clear water.", price: 300 },
  { id: 3, name: "Palawan", description: "Island paradise with stunning lagoons.", price: 350 },
];

// GET all destinations
router.get('/', (req, res) => {
  res.json(destinations);
});

// GET a single destination by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const destination = destinations.find(d => d.id === id);
  if (!destination) return res.status(404).json({ error: "Destination not found" });
  res.json(destination);
});

// POST a new destination (optional for testing)
router.post('/', (req, res) => {
  const { name, description, price } = req.body;
  const newDestination = {
    id: destinations.length + 1,
    name,
    description,
    price,
  };
  destinations.push(newDestination);
  res.json(newDestination);
});

module.exports = router;