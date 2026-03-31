const express = require('express');
const router = express.Router();
const supabase = require('../services/supabaseClient');

const TOURS_TABLE = process.env.SUPABASE_TOURS_TABLE || 'tours';

// GET all tours
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from(TOURS_TABLE).select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch tours' });
  }
});

// GET single tour by numeric ID
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Tour ID must be a number' });

    const { data, error } = await supabase
      .from(TOURS_TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) return res.status(404).json({ error: error.message || 'Tour not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch tour' });
  }
});

module.exports = router;