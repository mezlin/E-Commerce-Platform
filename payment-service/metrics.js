const client = require('prom-client');

//Create a registry
const register = new client.Registry();

//Set default labels for metrics
register.setDefaultLabels({
    app: process.env.npm_package_name || 'payment-service',
});

//Collect default metrics
client.collectDefaultMetrics({ register });

//Define custom metrics

//Histogram for request durations
const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 7.5, 10]
});

module.exports = {
    register,
    httpRequestDuration
};
