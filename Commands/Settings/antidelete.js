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
            groupSettings.antidelete = true;
            await groupSettings.save();
            await m.reply(`✅ Antidelete has been turned ON for this group. Deleted messages will be forwarded to your inbox.`);
        } else if (value === 'off') {
            groupSettings.antidelete = false;
            await groupSettings.save();
            await m.reply(`❌ Antidelete has been turned OFF for this group.`);
        } else {
            await m.reply(`📄 Current Antidelete setting for this group: ${groupSettings.antidelete ? 'ON' : 'OFF'}\n\n Use "antidelete on" or "antidelete off".`);
        }
    });
};