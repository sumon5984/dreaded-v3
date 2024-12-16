const { getGroupSettings } = require('../../Mongodb/Settingsdb');
const ownerMiddleware = require('../../Middleware/ownerMiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args } = context;
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

        const Myself = await client.decodeJid(client.user.id);

        let groupMetadata = await client.groupMetadata(m.chat);
        let userAdmins = groupMetadata.participants.filter(p => p.admin !== null).map(p => p.id);

        const isBotAdmin = userAdmins.includes(Myself);

        if (value === 'on' && !isBotAdmin) {
            return await m.reply('I need admin privileges to handle antispam feature.');
        }

        if (value === 'on' || value === 'off') {
            const action = value === 'on' ? true : false;
            const actionText = value === 'on' ? 'ON' : 'OFF';
            const actionMsg = value === 'on' ? 'turned ON' : 'turned OFF';

            if (groupSettings.antispam === action) {
                return await m.reply(`✅ Anti-spam was already ${actionText}.`);
            }

            groupSettings.antispam = action;
            await groupSettings.save();

            if (value === 'on') {
                await m.reply(`✅ Anti-spam has been ${actionMsg}, Bot will try to detect and remove spammers. This feature is in testing.`);
            } else {
                await m.reply(`❌ Anti-spam has been ${actionMsg} for this group.`);
            }
        } else {
            await m.reply(`📄 Current anti-spam setting for this group: ${groupSettings.antispam ? 'ON' : 'OFF'}\n\n Use "antispam on" or "antispam off".`);
        }
    });
};