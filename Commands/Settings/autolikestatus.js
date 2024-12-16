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
            settings.autolikestatus = true;
            await settings.save();
            await m.reply('✅ Autolikestatus has been turned ON. Bot will now like status with a custom emoji.');
        } else if (value === 'off') {
            settings.autolikestatus = false;
            await settings.save();
            await m.reply('❌ Autolikestatus has been turned OFF.');
        } else {
            await m.reply(`📄 Current autolikestatus setting: ${settings.autolikestatus ? 'ON' : 'OFF'}\n\nUse "autolikestatus on" or "autolikestatus off".`);
        }
    });
};