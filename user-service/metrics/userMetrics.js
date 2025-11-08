const client = require('prom-client');
const { register } = require('../metrics/prometheus');

//Counter for total users created
const usersCreatedTotal = new client.Counter({
  name: 'users_created_total',
  help: 'Total number of users created',
  register: register
});

//Gauge for current online users
const usersOnlineTotal = new client.Gauge({
  name: 'users_online_total',
  help: 'Total number of users currently online',
  register: register
});

module.exports = {
  usersCreatedTotal,
  usersOnlineTotal
};