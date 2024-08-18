const Role = require('../models/roleModel');

exports.assignRole = async (req, res) => {
  const { userId, role } = req.body;
  try {
    const existingRole = await Role.findOne({ user: userId, room: req.params.roomId });
    if (existingRole) {
      existingRole.role = role;
      await existingRole.save();
    } else {
      await Role.create({
        user: userId,
        room: req.params.roomId,
        role,
      });
    }
    res.status(200).json({ message: 'Role assigned successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
