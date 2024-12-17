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
            if (settings.anticall) {
                return await m.reply('✅ Anti-call was already ON.');
            }
            settings.anticall = true;
            await settings.save();
            await m.reply('✅ Anti-call has been turned ON. Bot will now reject calls and ban the caller.');
        } else if (value === 'off') {
            if (!settings.anticall) {
                return await m.reply('✅ Anti-call was already OFF.');
            }
if (settings.dnd) {
                return await m.reply('Do Not Disturb mode is active and anticall cannot be disabled. Please exit DND mode first.');
            }


            settings.anticall = false;
            await settings.save();
            await m.reply('❌ Anti-call has been turned OFF.');
        } else {
            await m.reply(`📄 Current anti-call setting: ${settings.anticall ? 'ON' : 'OFF'}\n\nUse "anticall on" or "anticall off".`);
        }
    });
};