const {
  isSpamming,
  hasBeenWarned,
  markAsWarned,
  clearWarning,
} = require("../Functions/spamDetector");
const { getSettings } = require("./database");
const { smsg } = require("./smsg");
const dreadedHandler = require("../dreaded");

const spamCheck = require('../Functions/antispamm'); 



const handleMessage = async (client, chatUpdate, store) => {
  try {
    const mek = chatUpdate.messages[0];
    if (!mek.message) return;

  
    const Myself = await client.decodeJid(client.user.id);

    
    
    const Chat = mek.key.remoteJid;

   
    const settings = await getSettings();

   
    if (settings && settings.autoread && mek.key && mek.key.remoteJid.endsWith("@s.whatsapp.net")) {
      await client.readMessages([mek.key]);
    }

    
    if (settings && settings.presence) {
      const presenceType = {
        online: "available",
        typing: "composing",
        recording: "recording",
        offline: "unavailable",
      }[settings.presence];

      if (presenceType) await client.sendPresenceUpdate(presenceType, Chat);
    }

    
    if (!client.public && !mek.key.fromMe && chatUpdate.type === "notify") return;
    if (mek.key.id.startsWith("BAE5") && mek.key.id.length === 16) return;

    
    
   
    

const m = smsg(client, mek, store);

         
    await spamCheck(client, m);

    dreadedHandler(client, m, chatUpdate, store);
  } catch (err) {
    console.error(err);
  }
};

module.exports = handleMessage; 