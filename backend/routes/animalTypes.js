const express = require('express');
const router = express.Router();
const AnimalType = require('../models/animalType');

// Routes for CRUD operations on the animal_types table
// GET '/' returns all animal types
// POST '/' inserts a new animal type and returns its id

// TODO: Add routes for updating and deleting animal types

router.get('/', (req, res) => {
  AnimalType.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  AnimalType.create(req.body.name, (err, result) => {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json(result);
  });
});

module.exports = router;
