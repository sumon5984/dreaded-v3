const {
  isSpamming,
  hasBeenWarned,
  markAsWarned,
  clearWarning,
} = require("./spamDetector");

const { createUser, getUser, isUserBanned } = require('../Mongodb/Userdb');  
const { getGroupSettings, getSettings } = require('../Mongodb/Settingsdb');

module.exports = async (client, m) => {
  const senderId = m.sender;
  const groupId = m.chat;
  const checkdev = senderId.split('@')[0];

  if (!groupId.endsWith("@g.us")) return;

  let settings = await getSettings();
  const currentDevs = settings.dev.split(',').map((num) => num.trim());

  if (currentDevs.includes(checkdev)) {
    console.log(`Sender ${senderId} is a sudo user. No action taken.`);
    return;
  }

  const groupSettings = await getGroupSettings(groupId);
  if (!groupSettings.antispam) {
    console.log(`Anti-spam is not enabled for group ${groupId}. No action taken.`);
    return;
  }

  if (isSpamming(senderId)) {
    if (!hasBeenWarned(senderId)) {
      console.log(`User ${senderId} is spamming.`);

      await client.sendMessage(
        groupId,
        {
          text: `@${senderId.split("@")[0]} why are you spamming ?`,
          contextInfo: {
            mentionedJid: [senderId],
          },
        },
        { quoted: m }
      );

      markAsWarned(senderId);
      await client.groupParticipantsUpdate(groupId, [senderId], "remove");

      await client.sendMessage(
        groupId,
        {
          text: `@${senderId.split("@")[0]} has been removed and banned for spamming.\nAntispam is active!`,
          contextInfo: {
            mentionedJid: [senderId],
          },
        },
        { quoted: m }
      );

      try {
        let user = await getUser(senderId);  
        if (!user) {
          console.log(`User ${senderId} not found. Creating user and banning them for spamming.`);
          user = await createUser(senderId);  // Create user in Userdb
          user.banned = true;
          user.banReason = 'spamming';
        } else if (!user.banned) {
          console.log(`User ${senderId} found. Updating banned status due to spamming.`);
          user.banned = true;
          user.banReason = 'spamming';
        } else {
          console.log(`User ${senderId} is already banned. Reason: ${user.banReason || 'No reason provided'}`);
        }

        await user.save();
        console.log(`User ${senderId} banned for spamming.`);
      } catch (error) {
        console.error(`Error handling ban for ${senderId}:`, error.message);
      }
    }
  } else {
    clearWarning(senderId);
  }
}; 