const { getSettings } = require("../Mongodb/Settingsdb");
const { smsg } = require("./smsg");
const dreadedHandler = require("../dreaded");
const spamCheck = require('../Functions/antispamm');
const linkCheck = require('../Functions/antilink');
const tagCheck = require('../Functions/antitag');
const presenceCheck = require('../Functions/gcpresence');
const userCheck = require('../Functions/checkUser');
const viewonceCheck = require('../Functions/antionce');
const delCheck = require('../Functions/antidelete');
const dndCheck = require('../Functions/dnd')
const setPresenceAndAutoRead = require('../Functions/presence');
const reactToStatus = require('../Functions/autoreactstatus');

const handleMessage = async (client, chatUpdate, store) => {
  try {
    const mek = chatUpdate.messages[0];
    if (!mek.message) return;

    const Myself = await client.decodeJid(client.user.id);
   

    const settings = await getSettings();

    

      const m = smsg(client, mek, store);
    await spamCheck(client, m);

await tagCheck(client, m);
await linkCheck(client, m);
await presenceCheck(client, m);
await viewonceCheck(client, m);
await delCheck(client, m);
await dndCheck(client, m);
await setPresenceAndAutoRead(client, m);
await reactToStatus(client, m);
const proceed = await userCheck(client, m);
if (!proceed) {
    return;
}

    dreadedHandler(client, m, chatUpdate, store);

  } catch (err) {
    console.error(err);
  }
};

module.exports = handleMessage;