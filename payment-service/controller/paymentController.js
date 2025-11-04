const Payment = require('../models/Payment');

// Process payment
exports.processPayment = async (req, res) => {
  try {
    const payment = new Payment(req.body);
    
    // Here you would typically integrate with a payment gateway
    // For demo purposes, we'll simulate a successful payment
    payment.status = 'completed';
    payment.transactionId = 'txn_' + Date.now();
    
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get payment by ID
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payment by order ID
exports.getPaymentByOrder = async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user payments
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Process refund
exports.processRefund = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    if (payment.status !== 'completed') {
      return res.status(400).json({ message: 'Payment cannot be refunded' });
    }
    
    // Here you would typically integrate with a payment gateway for refund
    // For demo purposes, we'll simulate a successful refund
    payment.status = 'refunded';
    await payment.save();
    
    res.json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};