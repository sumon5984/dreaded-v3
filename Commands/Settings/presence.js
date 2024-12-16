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

        const validPresenceValues = ['online', 'offline', 'recording', 'typing'];

        if (validPresenceValues.includes(value)) {
            settings.presence = value;
            await settings.save();
            await m.reply(`✅ Presence has been updated to: ${value}`);
        } else {
            await m.reply(`📄 Current presence setting: ${settings.presence || 'undefined'}\n\n Use "presence online", "presence offline", "presence recording", or "presence typing".`);
        }
    });
};