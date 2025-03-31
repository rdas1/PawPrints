require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();

const dbPath = process.env.DB_PATH || ':memory:';
const seedOnBoot = process.env.SEED_ON_BOOT !== 'false'; // default true

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS animal_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Available for Adoption',
    animal_type_id INTEGER,
    priority TEXT DEFAULT 'Medium',
    FOREIGN KEY(animal_type_id) REFERENCES animal_types(id)
  )`);

  if (seedOnBoot) {
    db.get(`SELECT COUNT(*) as count FROM animal_types`, (err, row) => {
      if (err) return console.error('Error checking animal_types count:', err.message);
      if (row.count === 0) {
        const defaultTypes = ['Dog', 'Cat', 'Bird'];
        defaultTypes.forEach(type => {
          db.run(`INSERT INTO animal_types (name) VALUES (?)`, [type], err => {
            if (err) console.error('Error seeding animal_types:', err.message);
          });
        });
        console.log('✅ Default animal types seeded');
      }
    });
  }
});

module.exports = db;
