const client = require('prom-client');
const { register } = require('./prometheus');

//Counter for total payments processed
const paymentsProcessedTotal = new client.Counter({
  name: 'payments_processed_total',
  help: 'Total number of payments processed',
  labelNames: ['gateway', 'status'], // e.g., 'stripe', 'success'
  register: register
});

//Gauge for payment gateway status
const paymentGatewayStatus = new client.Gauge({
  name: 'payment_gateway_status',
  help: 'Status of payment gateways (1=up, 0=down)',
  labelNames: ['gateway'],
  register: register
});

module.exports = {
  paymentsProcessedTotal,
  paymentGatewayStatus
};