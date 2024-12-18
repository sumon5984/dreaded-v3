const { handleCallAndBan } = require('../Mongodb/Userdb');
const { getSettings } = require("../Mongodb/Settingsdb"); 

async function handleCall(json, client) {
  if (json.content[0].tag === 'offer') {
    const callCreator = json.content[0].attrs['call-creator'];

    const setti = await getSettings();
    const anticall = setti?.anticall?.toLowerCase();

    if (anticall === 'reject') {
      await client.rejectCall(json.content[0].attrs['call-id'], callCreator);
      client.sendMessage(callCreator, { text: "I am currently unavailable to pick calls. Send me a message or an SMS." });
    } else if (anticall === 'block') {
      await handleCallAndBan(json, client);
      await client.sendMessage(callCreator, { text: "You will be blocked and banned for calling the bot." });
      await client.updateBlockStatus(callCreator, 'block');
    }
  }
}

module.exports = { handleCall };