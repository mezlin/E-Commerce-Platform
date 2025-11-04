const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');

// Create a new order
router.post('/', orderController.createOrder);

// Get all orders
router.get('/', orderController.getOrders);

// Get order by ID
router.get('/:id', orderController.getOrderById);

// Update order status
router.patch('/:id/status', orderController.updateOrderStatus);

// Get orders by user ID
router.get('/user/:userId', orderController.getOrdersByUser);

module.exports = router;