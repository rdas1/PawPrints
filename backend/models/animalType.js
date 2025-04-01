const db = require('../db');
const { update } = require('./pet');

// Queries for Create and Read operations on the animal_types table
// TODO: Add Update and Delete operations
// The getAll method returns all animal types
// The create method inserts a new animal type and returns its id

const AnimalType = {
  getAll(callback) {
    db.all(`SELECT * FROM animal_types`, callback);
  },

  create(name, callback) {
    console.log("Creating animal type:", name);
    db.run(`INSERT INTO animal_types (name) VALUES (?)`, [name], function (err) {
      callback(err, { id: this.lastID });
    });
  },

};

module.exports = AnimalType;
