const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");
const dotenv = require("dotenv");
const { httpRequestDuration } = require('./metrics/prometheus');

// Determine which .env file to load
const envFile = process.env.NODE_ENV === "production"
    ? ".env.production" 
    : ".env.development";

const SERVICE_NAME = process.env.npm_package_name || 'user-service';

dotenv.config({ path: path.resolve(__dirname, envFile) });

const app = express();

const corsOptions = {
  origin: 'http://localhost:3001' // This is the origin of your frontend
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

//Metrics middleware
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({
      method: req.method,
      route: req.path,
      status_code: res.statusCode,
      service_name: SERVICE_NAME
    });
  });
  next();
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

// Import routes
const userRoutes = require('./routes/userRoutes');
const metricsRoutes = require('./routes/metricsRoutes');
const healthRoutes = require('./routes/healthRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api', metricsRoutes);
app.use('/api', healthRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});