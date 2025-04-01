const db = require('../db');

// Queries for CRUD operations on the pets table
// The getAll method returns all pets with their animal type names
// The create method inserts a new pet and returns its id
// The update method updates the status and priority of a pet
// The delete method deletes a pet by id

const Pet = {
  getAll(callback) {
    db.all(`
      SELECT pets.*, animal_types.name as animal_type
      FROM pets LEFT JOIN animal_types
      ON pets.animal_type_id = animal_types.id
    `, callback);
  },

  getById(id, callback) {
    db.get(`
      SELECT pets.*, animal_types.name as animal_type
      FROM pets
      LEFT JOIN animal_types ON pets.animal_type_id = animal_types.id
      WHERE pets.id = ?
    `, [id], callback);
  },

  getFiltered({ name, status, priority, animal_type_id, sortBy, sortOrder, limit, offset }, callback) {
    const conditions = [];
    const params = [];
  
    if (name) {
      conditions.push("LOWER(pets.name) LIKE ?");
      params.push(`%${name.toLowerCase()}%`);
    }
  
    if (status) {
      conditions.push("pets.status = ?");
      params.push(status);
    }
  
    if (priority) {
      conditions.push("pets.priority = ?");
      params.push(priority);
    }
  
    if (animal_type_id) {
      conditions.push("pets.animal_type_id = ?");
      params.push(animal_type_id);
    }
  
    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  
    let orderClause = "";
    if (sortBy) {
      const direction = sortOrder === "desc" ? "DESC" : "ASC";
      if (sortBy === "priority") {
        orderClause = `
          ORDER BY
            CASE pets.priority
              WHEN 'High' THEN 3
              WHEN 'Medium' THEN 2
              WHEN 'Low' THEN 1
            END ${direction}
        `;
      } else if (sortBy === "name") {
        orderClause = `ORDER BY pets.name COLLATE NOCASE ${direction}`;
      }
    }

    let limitClause = "LIMIT 10 OFFSET 0";
    if (limit !== undefined && offset !== undefined) {
      limitClause = `LIMIT ${limit} OFFSET ${offset}`;
    }
  
    db.all(
      `
      SELECT pets.*, animal_types.name as animal_type
      FROM pets
      LEFT JOIN animal_types ON pets.animal_type_id = animal_types.id
      ${whereClause}
      ${orderClause}
      ${limitClause}
      `,
      params,
      callback
    );
  },  

  create({ name, status = 'Available for Adoption', animal_type_id, priority = 'Medium' }, callback) {
    db.run(`
      INSERT INTO pets (name, status, animal_type_id, priority)
      VALUES (?, ?, ?, ?)
    `, [name, status, animal_type_id, priority], function (err) {
      callback(err, { id: this.lastID });
    });
  },

  update(id, { status, priority }, callback) {
    db.run(`
      UPDATE pets SET status = ?, priority = ?
      WHERE id = ?
    `, [status, priority, id], callback);
  },

  delete(id, callback) {
    db.run(`DELETE FROM pets WHERE id = ?`, [id], callback);
  },
};

module.exports = Pet;
