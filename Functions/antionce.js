
    
module.exports = async (client, m) => {


const { getSettings } = require("../Mongodb/Settingsdb");

    const settings = await getSettings();

  if (settings.antionce && m.mtype == 'viewOnceMessageV2') {
  if (m.fromMe) return;
  
   let mokaya = { ...m };
        let msg = mokaya.message?.viewOnceMessage?.message || mokaya.message?.viewOnceMessageV2?.message;
        delete msg[Object.keys(msg)[0]].viewOnce;
        mokaya.message = msg;

        await client.sendMessage(client.user.id, { forward: mokaya }, { quoted: m });

}     

};   