const { getGroupSettings, getSettings } = require('../Mongodb/Settingsdb');

module.exports = async (client, m) => {
  const userId = m.sender;
  const groupId = m.chat;
  
  
    
  if (!groupId.endsWith("@g.us")) return;
const groupSettings = await getGroupSettings(groupId);
  if (groupSettings.gcpresence) {
  
  let dreadrecordin = ['recording', 'composing'];
        let dreadrecordinfinal = dreadrecordin[Math.floor(Math.random() * dreadrecordin.length)];
        await client.sendPresenceUpdate(dreadrecordinfinal, m.chat);
   

}     
        
};  