const redis = require('redis');

const client = redis.createClient({
  port: 6379,
  host: '127.0.0.1',
})

client.on('connect', function() {
  console.log('Client connected to redis...')
})

client.on('ready', function() {
  console.log('Client connected to redis and ready to use...');
})

client.on('error', function(err) {
  console.log(err.message);
})

client.on('end', function() {
  console.log('Client disconnected from redis');
})

process.on('SIGINT', function() {
  client.quit();
})

module.exports = client;