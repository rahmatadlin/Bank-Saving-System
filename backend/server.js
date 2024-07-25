const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectToDatabase } = require('./config');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
let db;
connectToDatabase()
  .then((database) => {
    db = database;
    console.log('Connected to MongoDB');
    
    // Routes
    app.use('/api/customers', require('./src/routes/customerRoutes'));
    app.use('/api/accounts', require('./src/routes/accountRoutes'));
    app.use('/api/deposito-types', require('./src/routes/depositoTypeRoutes'));

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  });

// Make db accessible to the router
app.use((req, res, next) => {
  req.db = db;
  next();
});