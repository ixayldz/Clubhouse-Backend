const Notification = require('../models/notificationModel');

// Send real-time notification via Socket.IO
exports.sendRealTimeNotification = (io, userId, message, link = null) => {
  io.to(userId).emit('notification', { message, link });
};

// Store a notification in the database
exports.createNotification = async (userId, message, link = null) => {
  try {
    const notification = await Notification.create({ user: userId, message, link });
    return notification;
  } catch (err) {
    console.error('Notification error:', err);
    return null;
  }
};

// Get all notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
