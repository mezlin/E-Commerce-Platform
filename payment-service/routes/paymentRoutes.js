const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentController');

// Process payment
router.post('/', paymentController.processPayment);

// Get payment by ID
router.get('/:id', paymentController.getPayment);

// Get payment by order ID
router.get('/order/:orderId', paymentController.getPaymentByOrder);

// Get user payments
router.get('/user/:userId', paymentController.getUserPayments);

// Process refund
router.post('/:id/refund', paymentController.processRefund);

module.exports = router;