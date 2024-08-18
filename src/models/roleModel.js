const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  role: {
    type: String,
    enum: ['moderator', 'speaker', 'listener'],
    required: true,
  },
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
