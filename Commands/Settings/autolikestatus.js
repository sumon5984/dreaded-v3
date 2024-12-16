const { getSettings } = require('../../Mongodb/Settingsdb');
const ownerMiddleware = require('../../Middleware/ownerMiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { m, args } = context;
        const value = args[0]?.toLowerCase();

        let settings = await getSettings();

        if (!settings) {
            const Settings = require('../../Mongodb/Schemas/settingsSchema');
            settings = new Settings();
            await settings.save();
        }

        if (value === 'on') {
            if (settings.autolikestatus) {
                return await m.reply('✅ Autolikestatus is already ON.');
            }
            settings.autolikestatus = true;
            await settings.save();
            await m.reply('✅ Autolikestatus has been turned ON. Bot will now like status with a custom emoji.');
        } else if (value === 'off') {
            if (!settings.autolikestatus) {
                return await m.reply('❌ Autolikestatus is already OFF.');
            }
            settings.autolikestatus = false;
            await settings.save();
            await m.reply('❌ Autolikestatus has been turned OFF.');
        } else {
            await m.reply(`📄 Current autolikestatus setting: ${settings.autolikestatus ? 'ON' : 'OFF'}\n\nUse "autolikestatus on" or "autolikestatus off".`);
        }
    });
};