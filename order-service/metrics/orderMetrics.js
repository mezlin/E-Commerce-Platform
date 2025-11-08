const client = require('prom-client');
const { register } = require('../metrics/prometheus');

//Counter for total orders created
const ordersTotal = new client.Counter({
  name: 'orders_total',
  help: 'Total number of orders created',
  labelNames: ['status'], // 'success', 'failed', 'pending'
  register: register
});

module.exports = {
  ordersTotal
};