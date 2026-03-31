const express = require('express');
const router = express.Router();
const supabase = require('../services/supabaseClient');

// GET all tours
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('tours').select('*');

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// GET single tour
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

module.exports = router;