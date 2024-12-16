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
            return await m.reply('❌ I need admin privileges to turn on antidemote.');
        }

        if (value === 'on' || value === 'off') {
            const action = value === 'on' ? true : false;
            const actionText = value === 'on' ? 'ON' : 'OFF';
            const actionMsg = value === 'on' ? 'turned ON' : 'turned OFF';

            if (groupSettings.antidemote === action) {
                return await m.reply(`✅ Antidemote was already ${actionText}.`);
            }

            groupSettings.antidemote = action;
            await groupSettings.save();

            if (value === 'on') {
                await m.reply(`✅ Antidemote has been ${actionMsg} for this group. Bot will monitor and handle demotes.`);
            } else {
                await m.reply(`❌ Antidemote has been ${actionMsg} for this group.`);
            }
        } else {
            await m.reply(`📄 Current antidemote setting for this group: ${groupSettings.antidemote ? 'ON' : 'OFF'}\n\n Use "antidemote on" or "antidemote off".`);
        }
    });
};