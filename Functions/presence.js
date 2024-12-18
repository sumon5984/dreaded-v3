const { getSettings } = require("../Mongodb/Settingsdb");

const setPresence = async (client, m) => {
  const settings = await getSettings();
  
  if (m.key && m.key.remoteJid.endsWith('@s.whatsapp.net')) {
    const Chat = m.key.remoteJid;
    if (settings && settings.presence === 'online') {
      await client.sendPresenceUpdate("available", Chat);
    } else if (settings && settings.presence === 'typing') {
      await client.sendPresenceUpdate("composing", Chat);
    } else if (settings && settings.presence === 'recording') {
      await client.sendPresenceUpdate("recording", Chat);
    } else {
      await client.sendPresenceUpdate("unavailable", Chat);
    }
  }
};

module.exports = setPresence;