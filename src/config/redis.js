const redis = require('redis');

const redisClient = redis.createClient({
  socket: {
    host: '127.0.0.1', // Use localhost or your Redis server's IP
    port: 6379,
  },
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err.message);
  // Handle fallback here if needed, e.g., disable caching
});

redisClient.connect().catch((err) => {
  console.error('Failed to connect to Redis:', err.message);
});

module.exports = redisClient;
