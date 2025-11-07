const Order = require("../models/Order");
const ServiceCommunication = require("../utils/ServiceCommunication");
const path = require("path");
const dotenv = require("dotenv");

// Determine which .env file to load
const envFile = process.env.NODE_ENV === "production"
? ".env.production"
: ".env.development";

dotenv.config({ path: path.resolve(__dirname, envFile) });

const inventoryService = new ServiceCommunication(process.env.INVENTORY_SERVICE_URL);
const paymentService = new ServiceCommunication(process.env.PAYMENT_SERVICE_URL);

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { userId, products, totalAmount } = req.body;

    // Check inventory for all products
    for (const product of products) {
      const inventoryCheck = await inventoryService.makeRequest(
        "GET",
        `/api/products/${product.productId}`
      );

      if (!inventoryCheck || inventoryCheck.quantity < product.quantity) {
        return res.status(400).json({
          message: `Insufficient inventory for product ${product.productId}`,
        });
      }
    }

    // Create payment
    const payment = await paymentService.makeRequest("POST", "/api/payments", {
      amount: totalAmount,
      userId,
    });

    if (!payment || payment.status !== "success") {
      return res.status(400).json({
        message: "Payment failed",
      });
    }

    // Update inventory
    for (const product of products) {
      await inventoryService.makeRequest(
        "PUT",
        `/api/products/${product.productId}/reduce-stock`,
        { quantity: product.quantity }
      );
    }

    // Create order
    const order = new Order({
      userId,
      products,
      totalAmount,
      paymentId: payment.id,
      status: "confirmed",
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      message: "Error creating order",
      error: error.message,
    });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = req.body.status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get orders by user ID
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
