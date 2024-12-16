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
            groupSettings.antilink = true;
            await groupSettings.save();
            await m.reply(`✅ Antilink has been turned ON for this group. Bot will remove link senders.`);
        } else if (value === 'off') {
            groupSettings.antilink = false;
            await groupSettings.save();
            await m.reply(`❌ Antilink has been turned OFF for this group.`);
        } else {
            await m.reply(`_📄 Current antilink setting for this group: ${groupSettings.antilink ? 'ON' : 'OFF'}\n\nUse "antilink on" or "antilink off"._`);
        }
    });
};