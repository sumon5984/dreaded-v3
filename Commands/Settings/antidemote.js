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

        // If bot is not admin, return early when trying to enable antidemote
        if (value === 'on' && !isBotAdmin) {
            return await m.reply('❌ I need admin privileges to turn on antidemote.');
        }

        // Handling antidemote settings for both 'on' and 'off'
        if (value === 'on' || value === 'off') {
            const action = value === 'on' ? true : false;
            const actionText = value === 'on' ? 'ON' : 'OFF';
            const actionMsg = value === 'on' ? 'turned ON' : 'turned OFF';

            // If the setting is already in the desired state, inform the user
            if (groupSettings.antidemote === action) {
                return await m.reply(`✅ Antidemote was already ${actionText}.`);
            }

            // Update the setting and save it to the database
            groupSettings.antidemote = action;
            await groupSettings.save();
            await m.reply(`✅ Antidemote has been ${actionMsg} for this group.`);
        } else {
            // If no valid argument or invalid argument, return the current status
            await m.reply(`📄 Current antidemote setting for this group: ${groupSettings.antidemote ? 'ON' : 'OFF'}\n\n Use "antidemote on" or "antidemote off".`);
        }
    });
};