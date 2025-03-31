const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./pawprints.db');

// Create schema
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

  // Only seed if animal_types table is empty
  db.get(`SELECT COUNT(*) as count FROM animal_types`, (err, row) => {
    if (err) {
      console.error('Error checking animal_types count:', err.message);
    } else if (row.count === 0) {
      const defaultTypes = ['Dog', 'Cat', 'Bird'];
      defaultTypes.forEach(type => {
        db.run(
          `INSERT INTO animal_types (name) VALUES (?)`,
          [type],
          err => {
            if (err) console.error('Error seeding animal_types:', err.message);
          }
        );
      });
      console.log('✅ Default animal types seeded');
    }
  });
});

module.exports = db;
