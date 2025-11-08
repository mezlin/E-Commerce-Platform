const client = require('prom-client');

//Create the main Registry
const register = new client.Registry();

//Set default labels for all metrics
register.setDefaultLabels({
  app: 'inventory-service'
});

client.collectDefaultMetrics({ register });

//Define the HTTP Histogram
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code', 'service_name'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 7.5, 10] // Buckets in seconds
});

module.exports = {
  register,
  httpRequestDuration
};