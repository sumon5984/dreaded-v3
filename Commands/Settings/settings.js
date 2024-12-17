const { getSettings } = require('../../Mongodb/Settingsdb');  
const { getTotalUsers, getBannedUsers } = require('../../Mongodb/Userdb');  

module.exports = async (context) => {
    const { client, m } = context;

    
    const settings = await getSettings();
    if (!settings) {
        return await m.reply("⚠️ No settings found in the database.");
    }

    let response = `*Current Settings*\n`;
    response += `🔘 *Botname*: ${process.env.BOTNAME || settings.botname}\n`; 
    response += `🔘 *Prefix*: ${settings.prefix}\n`;
    response += `🔘 *Autoread*: ${settings.autoread ? '✅ ON' : '❌ OFF'}\n`;
    response += `🔘 *Autoview Status*: ${settings.autoviewstatus ? '✅ ON' : '❌ OFF'}\n`;
    response += `🔘 *Autolike Status*: ${settings.autolikestatus ? '✅ ON' : '❌ OFF'}\n`;
response += `🔘 *React Emoji*: ${settings.reactEmoji}\n`;
    response += `🔘 *Autobio*: ${settings.autobio ? '✅ ON' : '❌ OFF'}\n`;
    response += `🔘 *Anticall*: ${settings.anticall ? '✅ ON' : '❌ OFF'}\n`;
    response += `🔘 *Antionce*: ${settings.antionce ? '✅ ON' : '❌ OFF'}\n`;
    response += `🔘 *Presence*: ${settings.presence}\n`;

    const currentDevs = settings.dev.split(',').map((num) => num.trim());
    response += `\n*Statistics*\n`;
    response += `🔘 *Sudo Users*: ${currentDevs.length > 0 ? currentDevs.join(', ') : 'None'}\n`; 

    
    let getGroupzs = await client.groupFetchAllParticipating();
    let groupzs = Object.entries(getGroupzs)
        .slice(0)
        .map((entry) => entry[1]);
    let anaa = groupzs.map((v) => v.id);

    
    const totalUsers = await getTotalUsers();
            const { bannedCount } = await getBannedUsers();

    response += `🔘 *Total Users*: ${totalUsers}\n`;  
    response += `🔘 *Banned Users*: ${bannedCount}\n`;  
    response += `🔘 *Total Groups*: ${anaa.length}\n`; 

    
    await m.reply(response);
};