const client = require('prom-client');

client.collectDefaultMetrics();

//Define the HTTP Histogram
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code', 'service_name'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 7.5, 10], // Buckets in seconds
});

module.exports = {
  client,
  httpRequestDuration
};