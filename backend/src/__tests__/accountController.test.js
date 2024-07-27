// tests/accountController.test.js
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

describe('Account API', () => {
  it('should create an account', async () => {
    const customer = await db.collection('customers').insertOne({ name: 'John Doe' });
    const depositoType = await db.collection('depositoTypes').insertOne({ name: 'Savings', yearlyReturn: 5 });

    const response = await request(app)
      .post('/api/accounts')
      .send({
        customerId: customer.insertedId.toString(),
        depositoTypeId: depositoType.insertedId.toString(),
        balance: 1000
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('balance', 1000);
  });

  it('should retrieve all accounts', async () => {
    const response = await request(app).get('/api/accounts');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should retrieve a single account', async () => {
    const customer = await db.collection('customers').insertOne({ name: 'Jane Doe' });
    const depositoType = await db.collection('depositoTypes').insertOne({ name: 'Checking', yearlyReturn: 2 });
    const account = await db.collection('accounts').insertOne({
      customerId: customer.insertedId,
      depositoTypeId: depositoType.insertedId,
      balance: 1500
    });

    const response = await request(app).get(`/api/accounts/${account.insertedId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('balance', 1500);
  });

  it('should update an account', async () => {
    const customer = await db.collection('customers').insertOne({ name: 'Mark Smith' });
    const depositoType = await db.collection('depositoTypes').insertOne({ name: 'Investment', yearlyReturn: 7 });
    const account = await db.collection('accounts').insertOne({
      customerId: customer.insertedId,
      depositoTypeId: depositoType.insertedId,
      balance: 2000
    });

    const response = await request(app)
      .put(`/api/accounts/${account.insertedId}`)
      .send({ balance: 2500 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Account updated successfully');
  });

  it('should delete an account', async () => {
    const customer = await db.collection('customers').insertOne({ name: 'Lucy Brown' });
    const depositoType = await db.collection('depositoTypes').insertOne({ name: 'Retirement', yearlyReturn: 6 });
    const account = await db.collection('accounts').insertOne({
      customerId: customer.insertedId,
      depositoTypeId: depositoType.insertedId,
      balance: 3000
    });

    const response = await request(app).delete(`/api/accounts/${account.insertedId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Account deleted successfully');
  });
});