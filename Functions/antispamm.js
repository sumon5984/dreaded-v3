const {
  isSpamming,
  hasBeenWarned,
  markAsWarned,
  clearWarning,
} = require("./spamDetector");

const { createUser, getUser, isUserBanned } = require('../Mongodb/Userdb');  
const { getGroupSettings, getSettings } = require('../Mongodb/Settingsdb');

module.exports = async (client, m) => {
  const userId = m.sender; 
  const groupId = m.chat;
  const checkdev = userId.split('@')[0];  

  if (!groupId.endsWith("@g.us")) return;

  const groupMetadata = await client.groupMetadata(groupId);
  const groupAdmins = groupMetadata.participants
    .filter((participant) => participant.admin)
    .map((participant) => participant.id);

  const botId = client.decodeJid(client.user.id);

  if (!groupAdmins.includes(botId)) {
    
    return;
  }

  if (groupAdmins.includes(userId)) {
    
    return;
  }




  let settings = await getSettings();
  const currentDevs = settings.dev.split(',').map((num) => num.trim());

  if (currentDevs.includes(checkdev)) {
    
    return;
  }

  const groupSettings = await getGroupSettings(groupId);
  if (!groupSettings.antispam) {
    
    return;
  }

  if (isSpamming(userId)) {
    if (!hasBeenWarned(userId)) {
      

      await client.sendMessage(
        groupId,
        {
          text: `@${userId.split("@")[0]} why are you spamming ?`,
          contextInfo: {
            mentionedJid: [userId],
          },
        },
        { quoted: m }
      );

      markAsWarned(userId);
      await client.groupParticipantsUpdate(groupId, [userId], "remove");

      await client.sendMessage(
        groupId,
        {
          text: `@${userId.split("@")[0]} has been removed and banned for spamming.\nAntispam is active!`,
          contextInfo: {
            mentionedJid: [userId],
          },
        },
        { quoted: m }
      );

      try {
        let user = await getUser(userId);  

        if (!user) {
          
          user = await createUser(userId); 
          user.banned = true;
          user.banReason = 'spamming';
        } else if (!user.banned) {
          
          user.banned = true;
          user.banReason = 'spamming';
        } 

        await user.save();
        
      } catch (error) {
        console.error(`Error handling ban for ${userId}:`, error.message);
      }
    }
  } else {
    clearWarning(userId);
  }
};