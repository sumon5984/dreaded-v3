const path = require("path");


module.exports = async (client, m) => {


const { getGroupSettings, getSettings } = require('../Mongodb/Settingsdb');

  const groupId = m.chat;

      const groupSettings = await getGroupSettings(groupId);
      
        if (!groupId.endsWith("@g.us")) return;
      
      
      
      if (groupSettings.antidelete && m.message.protocolMessage && m.message.protocolMessage.type === 0) {
      
      
         let key = m.message.protocolMessage.key;

        try {
           
            const st = path.join(__dirname, '../store.json');
            const datac = fs.readFileSync(st, 'utf8');
            const jsonData = JSON.parse(datac);

            let messagez = jsonData.messages[key.remoteJid];
            let msgb;

            for (let i = 0; i < messagez.length; i++) {
                if (messagez[i].key.id === key.id) {
                    msgb = messagez[i];
                }
            }

            console.log(msgb);

            if (!msgb) {
                return console.log("Deleted message detected, error retrieving...");
            }

            await client.sendMessage(client.user.id, { forward: msgb }, { quoted: msgb });
           
            

        } catch (e) {
            console.log(e);
        }
    }
};
 