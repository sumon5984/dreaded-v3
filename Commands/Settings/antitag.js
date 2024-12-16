const { getGroupSettings } = require('../../Mongodb/Settingsdb'); 
const ownerMiddleware = require('../../Middleware/ownerMiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { m, args } = context;
        const value = args[0]?.toLowerCase();
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

        if (value === 'on') {
            
            groupSettings.antitag = true;
            await groupSettings.save();
            await m.reply(`✅ Antitag has been turned ON for this group. Bot will now remove members tagging or hidetagging!`);
        } else if (value === 'off') {
            
            groupSettings.antitag = false;
            await groupSettings.save();
            await m.reply(`❌ Antitag has been turned OFF for this group.`);
        } else {
          
            await m.reply(`📄 Current Antitag setting for this group: ${groupSettings.antitag ? 'ON' : 'OFF'}\n\n Use "antitag on" or "antitag off".`);
        }
    });
};