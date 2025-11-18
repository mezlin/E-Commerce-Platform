const client = require('prom-client');

//Gauge for current items in stock
const itemsInStock = new client.Gauge({
  name: 'inventory_items_in_stock',
  help: 'Current number of items in stock',
  labelNames: ['product_id', 'product_name']
});

//Counter for total items sold
const itemsSoldTotal = new client.Counter({
  name: 'inventory_items_sold_total',
  help: 'Total number of items sold',
  labelNames: ['product_id', 'product_name']
});

module.exports = {
  itemsInStock,
  itemsSoldTotal
};