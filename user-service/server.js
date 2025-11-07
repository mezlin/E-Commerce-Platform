const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");
const dotenv = require("dotenv");

// Determine which .env file to load
const envFile = process.env.NODE_ENV === "production" 
    ? ".env.production" 
    : ".env.development";

dotenv.config({ path: path.resolve(__dirname, envFile) });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

// Import routes
const userRoutes = require('./routes/userRoutes');

// Use routes
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});