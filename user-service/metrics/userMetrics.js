const client = require('prom-client');
const { register } = require('../metrics/prometheus');

// Counter for total users created
const usersCreatedTotal = new client.Counter({
  name: 'users_created_total',
  help: 'Total number of users created',
  registers: [register]
});

// Gauge for current online users
const usersOnlineTotal = new client.Gauge({
  name: 'users_online_total',
  help: 'Total number of users currently online',
  registers: [register]
});

// Counter for total login attempts
const loginAttemptsTotal = new client.Counter({
  name: 'login_attempts_total',
  help: 'Total number of login attempts',
  registers: [register]
});

module.exports = {
  usersCreatedTotal,
  usersOnlineTotal,
  loginAttemptsTotal
};
