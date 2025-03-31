const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db'); // can also use ':memory:' for in-memory database

// Create the tables if they don't exist

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS animal_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Available for Adoption',
      animal_type_id INTEGER,
      priority TEXT DEFAULT 'Medium',
      FOREIGN KEY(animal_type_id) REFERENCES animal_types(id)
    )
  `);
});

module.exports = db;
