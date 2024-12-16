const { getGroupSettings } = require('../../Mongodb/Settingsdb'); 
const ownerMiddleware = require('../../Middleware/ownerMiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args } = context;
        const jid = m.chat; 

        if (!jid.endsWith('@g.us')) {
            return await m.reply('❌ This command can only be used in groups.');
        }

        
        let groupSettings = await getGroupSettings(jid);

        if (!groupSettings) {
            const GroupSettings = require('../../Mongodb/Schemas/groupSettingsSchema');
            groupSettings = new GroupSettings({ jid });
            await groupSettings.save();
        }

        const value = args[0]?.toLowerCase();

        if (value === 'on') {
           
            groupSettings.antispam = true;
            await groupSettings.save();
            await m.reply('✅ Anti-spam has been turned ON. Bot will now remove spammers, however note that this feature might not work as expected yet!');
        } else if (value === 'off') {
           
            groupSettings.antispam = false;
            await groupSettings.save();
            await m.reply('❌ Anti-spam has been turned OFF.');
        } else {
           
            await m.reply(`📄 Current anti-spam setting: ${groupSettings.antispam ? 'ON' : 'OFF'}\n\n Use "antispam on" or "antispam off".`);
        }
    });
};