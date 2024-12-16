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
            settings.anticall = true;
            await settings.save();
            await m.reply('✅ Anti-call has been turned ON. Bot will now reject calls and ban the caller.');
        } else if (value === 'off') {
            settings.anticall = false;
            await settings.save();
            await m.reply('❌ Anti-call has been turned OFF.');
        } else {
            await m.reply(`📄 Current anti-call setting: ${settings.anticall ? 'ON' : 'OFF'}\n\n Use "anticall on" or "anticall off".`);
        }
    });
};