const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./pawprints.db");

const pets = [
  // Dogs (animal_type_id = 3)
  ["Rylee", "Adopted", "Low", 3],
  ["Buddy", "Adopted", "Low", 3],
  ["Luna", "Available", "Medium", 3],
  ["Max", "Available", "Low", 3],
  ["Daisy", "Adopted", "High", 3],
  ["Charlie", "Available", "Medium", 3],
  ["Bella", "Adopted", "Low", 3],
  ["Rocky", "Available", "High", 3],
  ["Milo", "Available", "Low", 3],
  ["Zoe", "Available", "Medium", 3],

  // Cats (animal_type_id = 2)
  ["Whiskers", "Available", "High", 2],
  ["Simba", "Adopted", "Medium", 2],
  ["Loki", "Available", "Low", 2],
  ["Mochi", "Available", "Medium", 2],
  ["Nala", "Adopted", "High", 2],
  ["Oliver", "Available", "Low", 2],
  ["Mittens", "Available", "Medium", 2],
  ["Tiger", "Adopted", "High", 2],
  ["Socks", "Available", "Low", 2],
  ["Cleo", "Available", "Medium", 2],

  // Birds (animal_type_id = 1)
  ["Chirpy", "Available", "High", 1],
  ["Tweety", "Adopted", "Medium", 1],
  ["Sky", "Available", "Low", 1],
  ["Sunny", "Available", "Medium", 1],
  ["Kiwi", "Adopted", "High", 1],
  ["Peaches", "Available", "Low", 1],
  ["Echo", "Available", "Medium", 1],
  ["Flapjack", "Adopted", "Low", 1],
  ["Jade", "Available", "High", 1],
  ["Bubbles", "Available", "Medium", 1],
];

db.serialize(() => {
  db.run("DELETE FROM pets", (err) => {
    if (err) return console.error("Failed to clear pets table:", err.message);
    console.log("✅ Cleared pets table.");
  });

  const stmt = db.prepare("INSERT INTO pets (name, status, priority, animal_type_id) VALUES (?, ?, ?, ?)");

  pets.forEach((pet) => {
    stmt.run(pet, (err) => {
      if (err) {
        console.error("❌ Failed to insert pet:", pet[0], "-", err.message);
      }
    });
  });

  stmt.finalize(() => {
    console.log("✅ Inserted", pets.length, "pets.");
    db.close();
  });
});
