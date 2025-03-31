const request = require('supertest');
const express = require('express');
const app = express();

// Setup app just like index.js
const db = require('../db');
const petRoutes = require('../routes/pets');
const animalRoutes = require('../routes/animalTypes');

app.use(express.json());
app.use('/pets', petRoutes);
app.use('/animal-types', animalRoutes);

beforeEach(done => {
  // Reinitialize DB schema for each test
  db.serialize(() => {
    db.run(`DELETE FROM pets`);
    db.run(`DELETE FROM animal_types`);
    db.run(`INSERT INTO animal_types (id, name) VALUES (1, 'Dog'), (2, 'Cat')`, done);
  });
});

describe('Pet API', () => {
  it('should create a new pet', async () => {
    const res = await request(app)
      .post('/pets')
      .send({
        name: 'Buddy',
        animal_type_id: 1,
        status: 'Available for Adoption',
        priority: 'High'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should retrieve all pets', async () => {
    await request(app).post('/pets').send({
      name: 'Max',
      animal_type_id: 2,
      status: 'In Care',
      priority: 'Medium'
    });

    const res = await request(app).get('/pets');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should retrieve a pet by ID', async () => {
    const createRes = await request(app).post('/pets').send({
      name: 'Luna',
      animal_type_id: 1
    });

    const id = createRes.body.id;
    const res = await request(app).get(`/pets/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Luna');
  });

  it('should update a pet\'s status and priority', async () => {
    const createRes = await request(app).post('/pets').send({
      name: 'Charlie',
      animal_type_id: 2
    });

    const res = await request(app)
      .put(`/pets/${createRes.body.id}`)
      .send({ status: 'Adopted', priority: 'Low' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should delete a pet', async () => {
    const createRes = await request(app).post('/pets').send({
      name: 'Coco',
      animal_type_id: 1
    });

    const res = await request(app).delete(`/pets/${createRes.body.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should filter pets by status', async () => {
    await request(app).post('/pets').send({
      name: 'Shadow',
      animal_type_id: 2,
      status: 'In Care',
      priority: 'Low'
    });

    const res = await request(app).get('/pets?status=In%20Care');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].status).toBe('In Care');
  });

  it('should filter pets by priority', async () => {
    await request(app).post('/pets').send({
      name: 'Milo',
      animal_type_id: 1,
      status: 'Available for Adoption',
      priority: 'High'
    });

    const res = await request(app).get('/pets?priority=High');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].priority).toBe('High');
  });

    it('should filter pets by animal type', async () => {
        await request(app).post('/pets').send({
        name: 'Bella',
        animal_type_id: 1,
        status: 'In Care',
        priority: 'Medium'
        });
    
        const res = await request(app).get('/pets?animal_type_id=1');
        expect(res.statusCode).toBe(200);
        expect(res.body[0].animal_type).toBe('Dog');
    });

    it('should filter pets by multiple filters', async () => {
        await request(app).post('/pets').send({
        name: 'Bella',
        animal_type_id: 1,
        status: 'In Care',
        priority: 'Medium'
        });
    
        const res = await request(app).get('/pets?animal_type_id=1&status=In%20Care');
        expect(res.statusCode).toBe(200);
        expect(res.body[0].animal_type).toBe('Dog');
        expect(res.body[0].status).toBe('In Care');
    });
});
