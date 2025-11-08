const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const { httpRequestDuration } = require('./metrics/prometheus');

// Determine which .env file to load
const envFile = process.env.NODE_ENV === "production" 
    ? ".env.production" 
    : ".env.development";

const SERVICE_NAME = process.env.npm_package_name || 'inventory-service';

dotenv.config({ path: path.resolve(__dirname, envFile) });

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files

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
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// Import routes
const productRoutes = require("./routes/productRoutes");
const healthRoutes = require("./routes/healthRoutes");
const metricsRoutes = require("./routes/metricsRoutes.js");

// Use routes
app.use("/api/products", productRoutes);
app.use("/api", healthRoutes);
app.use("/api", metricsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Inventory service running on port ${PORT}`);
});
