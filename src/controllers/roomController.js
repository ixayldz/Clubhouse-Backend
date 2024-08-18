const Room = require('../models/roomModel');

exports.createRoom = async (req, res) => {
  const { name, clubId, isPublic } = req.body;

  try {
    // Aynı isimde oda kontrolü
    const existingRoom = await Room.findOne({ name, club: clubId });
    if (existingRoom) {
      return res.status(400).json({ message: 'Bu isimle zaten bir oda var.' });
    }

    const room = await Room.create({
      name,
      club: clubId,
      owner: req.user.id,
      isPublic,
    });

    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};

exports.getRooms = async (req, res) => {
  try {
    // Populate owner and club details
    const rooms = await Room.find()
      .populate('owner', 'username')
      .populate('club', 'name');

    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a specific room by ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('owner', 'username')
      .populate('club', 'name');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.manageRoomSettings = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    // Check if the user is a moderator for this room
    const role = await Role.findOne({ user: userId, room: roomId });

    if (!role || role.role !== 'moderator') {
      return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
    }

    // Proceed with the room management logic
    // e.g., mute/unmute users, change room settings

    res.status(200).json({ message: 'Room settings updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};