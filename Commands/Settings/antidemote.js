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

        // If the value is 'off', we turn it off regardless of whether the bot is an admin
        if (value === 'off') {
            groupSettings.antidemote = false;
            await groupSettings.save();
            return await m.reply('❌ Antidemote has been turned OFF for this group.');
        }

        // If bot is not admin and user tries to turn antidemote on
        if (!isBotAdmin && value === 'on') {
            return await m.reply('❌ I need admin privileges to enable antidemote.');
        }

        // If the bot is admin, proceed with updating the group setting
        if (isBotAdmin) {
            if (value === 'on') {
                groupSettings.antidemote = true;
                await groupSettings.save();
                await m.reply(`✅ Antidemote has been turned ON for this group. Bot will now detect demotes and restrict some!`);
            } else if (value === 'off') {
                groupSettings.antidemote = false;
                await groupSettings.save();
                await m.reply(`❌ Antidemote has been turned OFF for this group.`);
            } else {
                // Invalid or no argument, reply with current setting
                await m.reply(`📄 Current antidemote setting for this group: ${groupSettings.antidemote ? 'ON' : 'OFF'}\n\n Use "antidemote on" or "antidemote off".`);
            }
        } else {
            // Invalid or no argument, reply with current setting regardless of admin status
            await m.reply(`📄 Current antidemote setting for this group: ${groupSettings.antidemote ? 'ON' : 'OFF'}\n\n Use "antidemote on" or "antidemote off".`);
        }
    });
};