const { getGroupSettings } = require('../Mongodb/Settingsdb');

module.exports = async (client, m) => {
  const userId = m.sender;
  const groupId = m.chat;

  if (!groupId.endsWith("@g.us")) return;

  const groupMetadata = await client.groupMetadata(groupId);
  const groupAdmins = groupMetadata.participants
    .filter((participant) => participant.admin)
    .map((participant) => participant.id);

  const botId = client.decodeJid(client.user.id);

  if (!groupAdmins.includes(botId)) {
    console.log(`Bot is not an admin in group ${groupId}. No action taken.`);
    return;
  }

if (botId.includes(userId)) return;
    
  


  if (groupAdmins.includes(userId)) {
    console.log(`User ${userId} is an admin in group ${groupId}. No action taken.`);
    return;
  }

  const groupSettings = await getGroupSettings(groupId);
  if (!groupSettings.antitag) {
    console.log(`Antitag is not enabled for group ${groupId}. No action taken.`);
    return;
  }

  
  if (m.mentionedJid && m.mentionedJid.length > 10) {
    
await client.sendMessage(m.chat, {text:`@${userId.split("@")[0]}, tagging is prohibited.\nAntitag is active!`, contextInfo:{mentionedJid:[userId]}}, {quoted:m}); 

await client.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: m.key.id,
                participant: userId
            }
        });

    await client.groupParticipantsUpdate(groupId, [userId], "remove");


  }
};  