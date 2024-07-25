const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/customers', require('./src/routes/customerRoutes'));
app.use('/api/accounts', require('./src/routes/accountRoutes'));
app.use('/api/deposito-types', require('./src/routes/depositoTypeRoutes'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});