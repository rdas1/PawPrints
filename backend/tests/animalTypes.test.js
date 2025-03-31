const request = require('supertest');
const express = require('express');
const app = express();

// Setup app with routes
const db = require('../db');
const animalRoutes = require('../routes/animalTypes');

app.use(express.json());
app.use('/animal-types', animalRoutes);

beforeEach(done => {
  db.serialize(() => {
    db.run(`DELETE FROM animal_types`, () => {
      db.run(`INSERT INTO animal_types (id, name) VALUES (1, 'Dog'), (2, 'Cat')`, done);
    });
  });
});

describe('Animal Types API', () => {
  it('should retrieve all animal types', async () => {
    const res = await request(app).get('/animal-types');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('name');
  });

  it('should create a new custom animal type', async () => {
    const res = await request(app)
      .post('/animal-types')
      .send({ name: 'Rabbit' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should not allow duplicate animal type names', async () => {
    const res = await request(app)
      .post('/animal-types')
      .send({ name: 'Dog' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should fail to create an animal type without a name', async () => {
    const res = await request(app)
      .post('/animal-types')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
