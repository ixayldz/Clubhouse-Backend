const Event = require('../models/eventModel');

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const { name, description, scheduledTime, clubId, roomId } = req.body;

    const event = await Event.create({
      name,
      description,
      scheduledTime,
      club: clubId,
      room: roomId,
      createdBy: req.user.id,
    });

    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all upcoming events
exports.getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.find({
      scheduledTime: { $gte: new Date() },
    }).populate('club room createdBy', 'name username');

    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
