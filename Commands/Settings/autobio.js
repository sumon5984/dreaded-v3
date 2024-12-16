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
            if (settings.autobio) {
                return await m.reply('✅ Autobio was already ON.');
            }
            settings.autobio = true;
            await settings.save();
            await m.reply('✅ Autobio has been turned ON. Bot will auto-update about every 10 seconds.');
        } else if (value === 'off') {
            if (!settings.autobio) {
                return await m.reply('✅ Autobio was already OFF.');
            }
            settings.autobio = false;
            await settings.save();
            await m.reply('❌ Autobio has been turned OFF.');
        } else {
            await m.reply(`📄 Current autobio setting: ${settings.autobio ? 'ON' : 'OFF'}\n\nUse "autobio on" or "autobio off".`);
        }
    });
};