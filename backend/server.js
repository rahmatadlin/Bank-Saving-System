// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectToDatabase } = require('./src/config');
const { swaggerUi, swaggerSpec } = require('./swagger');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let db;
connectToDatabase()
  .then((database) => {
    db = database;
    console.log('Connected to MongoDB');
    
    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use('/api/customers', require('./src/routes/customerRoutes'));
    app.use('/api/accounts', require('./src/routes/accountRoutes'));
    app.use('/api/deposito-types', require('./src/routes/depositoTypeRoutes'));
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  });

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app; // Export app for testing
