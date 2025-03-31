const express = require('express');
const router = express.Router();
const Pet = require('../models/pet');

// Routes for CRUD operations on the pets table
// GET '/' returns all pets with their animal type names
// POST '/' inserts a new pet and returns its id
// PUT '/:id' updates the status and priority of a pet
// DELETE '/:id' deletes a pet by id

// TODO: Add route for getting pet by name

router.get('/', (req, res) => {
    Pet.getFiltered(req.query, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});  

router.get('/:id', (req, res) => {
    Pet.getById(req.params.id, (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Pet not found" });
        res.json(row);
    });
});

router.post('/', (req, res) => {
    Pet.create(req.body, (err, pet) => {
        if (err) return res.status(400).json({ error: err.message });
        res.status(201).json(pet);
    });
});

router.put('/:id', (req, res) => {
    Pet.update(req.params.id, req.body, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ success: true });
    });
});

router.delete('/:id', (req, res) => {
    Pet.delete(req.params.id, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ success: true });
    });
});

module.exports = router;
