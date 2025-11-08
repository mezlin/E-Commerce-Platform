const client = require('prom-client');
const { register } = require('../metrics/prometheus');

//Gauge for current items in stock
const itemsInStock = new client.Gauge({
  name: 'inventory_items_in_stock',
  help: 'Current number of items in stock',
  labelNames: ['item_sku'],
  register: register
});

//Counter for total items sold
const itemsSoldTotal = new client.Counter({
  name: 'inventory_items_sold_total',
  help: 'Total number of items sold',
  labelNames: ['item_sku'],
  register: register
});

module.exports = {
  itemsInStock,
  itemsSoldTotal
};