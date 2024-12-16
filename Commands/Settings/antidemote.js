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
            groupSettings.antidemote = true;
            await groupSettings.save();
            await m.reply(`✅ Antidemote has been turned ON for this group. Bot will now detect denotes and restrict some!`);
        } else if (value === 'off') {
            groupSettings.antidemote = false;
            await groupSettings.save();
            await m.reply(`❌ Antidemote has been turned OFF for this group.`);
        } else {
            await m.reply(`📄 Current antidemote setting for this group: ${groupSettings.antidemote ? 'ON' : 'OFF'}\n\n Use "antidemote on" or "antidemote off".`);
        }
    });
};