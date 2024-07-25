const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGODB_CONNECTION_STRING;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const dbName = "Bank-Saving-System";

async function connectToDatabase() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected successfully to MongoDB");

    const db = client.db(dbName);

    // Create collections based on models
    await db.createCollection("customers");
    await db.createCollection("accounts");
    await db.createCollection("depositoTypes");

    console.log("Collections created successfully");

    return db;
  } catch (error) {
    console.error("Error connecting to the database", error);
    throw error;
  }
}

module.exports = { connectToDatabase, client };