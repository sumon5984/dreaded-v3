const { getSettings } = require("../Mongodb/Settingsdb");
const { smsg } = require("./smsg");
const dreadedHandler = require("../dreaded");
const spamCheck = require('../Functions/antispamm');

const handleMessage = async (client, chatUpdate, store) => {
  try {
    const mek = chatUpdate.messages[0];
    if (!mek.message) return;

    const Myself = await client.decodeJid(client.user.id);
    // const Chat = mek.key.remoteJid;

    const settings = await getSettings();

    if (settings && settings.autoread && mek.key && mek.key.remoteJid.endsWith("@s.whatsapp.net")) {
      await client.readMessages([mek.key]);
    }

    if (settings && settings.autoviewstatus && settings.autolikestatus && mek.key && mek.key.remoteJid === "status@broadcast") {
      let reactEmoji;
      if (settings.reactEmoji === 'random') {
        const emojis = ['😀', '😁', '😂', '😅', '😎', '😜', '😊', '😍', '😋', '😄', '😃'];
        reactEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      } else {
        reactEmoji = settings.reactEmoji;
      }

      /* await client.sendMessage(mek.key.remoteJid, { react: { key: mek.key, text: '❤️' }}, { statusJidList: [mek.key.participant, Myself], broadcast: true });

*/

      if (settings && settings.autoviewstatus === 'true' && mek.key && mek.key.remoteJid === "status@broadcast") {

const mokayas = await client.decodeJid(client.user.id);

// if (mek.status) return;

await client.sendMessage(mek.key.remoteJid, { react: { key: mek.key, text: '🌻'}}, { statusJidList: [mek.key.participant, mokayas], broadcast: true});


        await client.readMessages([mek.key]);
      }
    }

    if (mek.key && mek.key.remoteJid.endsWith('@s.whatsapp.net')) {
      const Chat = mek.key.remoteJid;
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

    const m = smsg(client, mek, store);
    await spamCheck(client, m);

    dreadedHandler(client, m, chatUpdate, store);

  } catch (err) {
    console.error(err);
  }
};

module.exports = handleMessage;


