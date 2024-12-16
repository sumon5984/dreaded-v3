const { getGroupSettings } = require('../../Mongodb/Settingsdb');
const ownerMiddleware = require('../../Middleware/ownerMiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { m, args, mycode } = context;
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
            groupSettings.antiforeign = true;
            await groupSettings.save();
            await m.reply(`✅ Antiforeign has been turned ON for this group. Bot will now automatically remove non-${mycode} numbers joining!`);
        } else if (value === 'off') {
            groupSettings.antiforeign = false;
            await groupSettings.save();
            await m.reply(`❌ Antiforeign has been turned OFF for this group.`);
        } else {
            await m.reply(`📄 Current antiforeign setting for this group: ${groupSettings.antiforeign ? 'ON' : 'OFF'}\n\n Use "antiforeign on" or "antiforeign off".`);
        }
    });
};