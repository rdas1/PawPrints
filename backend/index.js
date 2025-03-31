const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

const db = require('./db'); // initializes tables
const petRoutes = require('./routes/pets');
const animalRoutes = require('./routes/animalTypes');

app.use(cors());
app.use(express.json());

app.use('/pets', petRoutes);
app.use('/animal-types', animalRoutes);

app.listen(port, () => {
  console.log(`🐾 PawPrints API listening on http://localhost:${port}`);
});
