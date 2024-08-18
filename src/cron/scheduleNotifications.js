const cron = require('node-cron');
const Event = require('../models/eventModel');
const Club = require('../models/clubModel');
const { createNotification } = require('../controllers/notificationController');

// Schedule notifications 10 minutes before an event starts
const notificationTask = cron.schedule('* * * * *', async () => {
  const events = await Event.find({
    scheduledTime: {
      $gte: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
      $lt: new Date(Date.now() + 11 * 60 * 1000), // 11 minutes from now
    },
    notificationsSent: false,
  });

  for (const event of events) {
    const message = `Reminder: Event "${event.name}" starts in 10 minutes!`;

    // Notify all club members
    const clubMembers = await Club.findById(event.club).select('members').populate('members');
    for (const member of clubMembers.members) {
      await createNotification(member._id, message, `/events/${event._id}`);
    }

    // Mark notifications as sent
    event.notificationsSent = true;
    await event.save();
  }
});

// Export the cron job
module.exports = notificationTask;
