const spamTracker = {};
const warnedUsers = new Set();

function isSpamming(userId, threshold = 5, timeWindow = 10 * 1000) {
  const now = Date.now();

  if (!spamTracker[userId]) {
    spamTracker[userId] = [];
  }

  spamTracker[userId].push(now);

  spamTracker[userId] = spamTracker[userId].filter((timestamp) => now - timestamp <= timeWindow);

  return spamTracker[userId].length > threshold;
}

function hasBeenWarned(userId) {
  return warnedUsers.has(userId);
}

function markAsWarned(userId) {
  warnedUsers.add(userId);
}

function clearWarning(userId) {
  warnedUsers.delete(userId);
}

module.exports = {
  isSpamming,
  hasBeenWarned,
  markAsWarned,
  clearWarning,
};