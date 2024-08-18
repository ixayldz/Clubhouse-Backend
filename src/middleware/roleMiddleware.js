const Role = require('../models/roleModel');
const redisClient = require('../config/redis');

const checkRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const { roomId } = req.params;
      const userId = req.user.id;

      // Generate a cache key based on user ID and room ID
      const cacheKey = `role:${userId}:${roomId}`;

      // Check Redis cache first
      let role = await redisClient.get(cacheKey);

      if (!role) {
        // If not in cache, query the database
        const roleData = await Role.findOne({ user: userId, room: roomId });

        if (!roleData || roleData.role !== requiredRole) {
          return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
        }

        // Store the role in Redis cache (expire after 1 hour)
        await redisClient.set(cacheKey, roleData.role, { EX: 3600 });

        role = roleData.role;
      }

      // Proceed if the role matches the required role
      if (role === requiredRole) {
        next();
      } else {
        res.status(403).json({ message: 'Access denied: Insufficient permissions' });
      }
    } catch (err) {
      console.error('Role check error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
};

module.exports = { checkRole };
