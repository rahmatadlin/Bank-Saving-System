// tests/depositoTypeController.test.js
const request = require("supertest");
const { MongoClient } = require("mongodb");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Mock the database connection
jest.mock("../config", () => ({
  connectToDatabase: jest.fn(),
}));

const { connectToDatabase } = require("../config");

let mongoServer;
let client;
let db;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  client = new MongoClient(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  db = client.db("testdb");

  // Mock the database connection
  connectToDatabase.mockResolvedValue(db);

  // Now that we've mocked the database connection, we can require the app
  app = require("../../server");
});

afterAll(async () => {
  await client.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await db.collection("depositoTypes").deleteMany({});
});

describe("DepositoType API", () => {
  it("should create a deposito type", async () => {
    const response = await request(app)
      .post("/api/deposito-types")
      .send({ name: "Fixed Deposit", yearlyReturn: 4.5 });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: "Fixed Deposit",
      yearlyReturn: 4.5,
    });
  });

  it("should retrieve all deposito types", async () => {
    await db
      .collection("depositoTypes")
      .insertOne({ name: "Recurring Deposit", yearlyReturn: 3.5 });

    const response = await request(app).get("/api/deposito-types");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toMatchObject({
      name: "Recurring Deposit",
      yearlyReturn: 3.5,
    });
  });

  it("should retrieve a single deposito type", async () => {
    const result = await db
      .collection("depositoTypes")
      .insertOne({ name: "Savings Bond", yearlyReturn: 2.0 });

    const response = await request(app).get(
      `/api/deposito-types/${result.insertedId}`
    );
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      name: "Savings Bond",
      yearlyReturn: 2.0,
    });
  });

  it("should update a deposito type", async () => {
    const result = await db
      .collection("depositoTypes")
      .insertOne({ name: "High Yield", yearlyReturn: 6.0 });

    const response = await request(app)
      .put(`/api/deposito-types/${result.insertedId}`)
      .send({ name: "High Yield Updated", yearlyReturn: 6.5 });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      message: "Deposito type updated successfully",
    });
  });

  it("should delete a deposito type", async () => {
    const result = await db
      .collection("depositoTypes")
      .insertOne({ name: "Standard Deposit", yearlyReturn: 3.0 });

    const response = await request(app).delete(
      `/api/deposito-types/${result.insertedId}`
    );
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      message: "Deposito type deleted successfully",
    });
  });

  it("should return 404 for non-existent deposito type", async () => {
    const fakeId = "000000000000000000000000";
    const response = await request(app).get(`/api/deposito-types/${fakeId}`);
    expect(response.status).toBe(404);
  });
});
