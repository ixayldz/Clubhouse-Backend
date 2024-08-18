const Message = require('../models/messageModel');

exports.sendMessage = async (req, res) => {
  const { roomId, content } = req.body;
  try {
    const message = await Message.create({
      room: roomId,
      sender: req.user.id,
      content,
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMessages = async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await Message.find({ room: roomId });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
