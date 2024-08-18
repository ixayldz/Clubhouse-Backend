const Queue = require('bull');
const messageQueue = new Queue('messageQueue');

messageQueue.process(async (job) => {
  const { roomId, message } = job.data;
  io.to(roomId).emit('receiveMessage', message);
});

module.exports = messageQueue;
