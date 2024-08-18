const Club = require('../models/clubModel');

exports.createClub = async (req, res) => {
  const { name, description } = req.body;
  try {
    const existingClub = await Club.findOne({ name });
    if (existingClub) {
      return res.status(400).json({ message: 'Club name already exists' });
    }

    const club = await Club.create({
      name,
      owner: req.user.id,
      description,
    });
    res.status(201).json(club);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getClubs = async (req, res) => {
  try {
    const clubs = await Club.find().populate('owner', 'username');
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).populate('owner', 'username');
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    res.json(club);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
