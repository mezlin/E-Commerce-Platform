const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// Import routes
const paymentRoutes = require("./routes/paymentRoutes");
const healthRoutes = require("./routes/healthRoutes");

// Use routes
app.use("/api/payments", paymentRoutes);
app.use("/api", healthRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
});
