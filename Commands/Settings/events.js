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
            if (groupSettings.events) {
                return await m.reply(`✅ Events are already ON for this group.`);
            }
            groupSettings.events = true;
            await groupSettings.save();
            await m.reply(`✅ Events have been turned ON for this group. Bot will now send welcome and farewell messages!`);
        } else if (value === 'off') {
            if (!groupSettings.events) {
                return await m.reply(`❌ Events are already OFF for this group.`);
            }
            groupSettings.events = false;
            await groupSettings.save();
            await m.reply(`❌ Events have been turned OFF for this group.`);
        } else {
            await m.reply(`📄 Current events setting for this group: ${groupSettings.events ? 'ON' : 'OFF'}\n\n Use "events on" or "events off".`);
        }
    });
};