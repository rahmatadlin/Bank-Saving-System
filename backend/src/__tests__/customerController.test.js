// tests/customerController.test.js
const request = require('supertest');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Mock the database connection
jest.mock('../config', () => ({
  connectToDatabase: jest.fn()
}));

const { connectToDatabase } = require('../config');

let mongoServer;
let client;
let db;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  db = client.db('testdb');

  // Mock the database connection
  connectToDatabase.mockResolvedValue(db);

  // Now that we've mocked the database connection, we can require the app
  app = require('../../server');
});

afterAll(async () => {
  await client.close();
  await mongoServer.stop();
});

describe('Customer API', () => {
  it('should create a customer', async () => {
    const response = await request(app)
      .post('/api/customers')
      .send({ name: 'Alice Johnson' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('name', 'Alice Johnson');
  });

  it('should retrieve all customers', async () => {
    await db.collection('customers').insertOne({ name: 'Bob Smith' });
    
    const response = await request(app).get('/api/customers');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should retrieve a single customer', async () => {
    const result = await db.collection('customers').insertOne({ name: 'Charlie Brown' });
    
    const response = await request(app).get(`/api/customers/${result.insertedId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Charlie Brown');
  });

  it('should update a customer', async () => {
    const result = await db.collection('customers').insertOne({ name: 'Diana Prince' });

    const response = await request(app)
      .put(`/api/customers/${result.insertedId}`)
      .send({ name: 'Diana Prince Updated' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Customer updated successfully');
  });

  it('should delete a customer', async () => {
    const result = await db.collection('customers').insertOne({ name: 'Eve Adams' });

    const response = await request(app).delete(`/api/customers/${result.insertedId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Customer deleted successfully');
  });
});