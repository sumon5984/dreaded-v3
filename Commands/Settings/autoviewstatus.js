const { getSettings } = require('../../Mongodb/Settingsdb');
const ownerMiddleware = require('../../Middleware/ownerMiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { m, args } = context;

        let settings = await getSettings();

        if (!settings) {
            const Settings = require('../../Mongodb/Schemas/settingsSchema');
            settings = new Settings();
            await settings.save();
        }

        const value = args[0]?.toLowerCase();

        if (value === 'on') {
            settings.autoviewstatus = true;
            await settings.save();
            await m.reply('✅ Autoviewstatus has been turned ON. Bot will autoview status update.');
        } else if (value === 'off') {
            settings.autoviewstatus = false;
            await settings.save();
            await m.reply('❌ Autoviewstatus has been turned OFF.');
        } else {
            await m.reply(`📄 Current autoviewstatus setting: ${settings.autoviewstatus ? 'ON' : 'OFF'}\n\nUse "autoviewstatus on" or "autoviewstatus off".`);
        }
    });
};