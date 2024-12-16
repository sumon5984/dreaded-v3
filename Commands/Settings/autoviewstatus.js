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

        if (value === 'on' || value === 'off') {
            const action = value === 'on';
            if (settings.autoviewstatus === action) {
                return await m.reply(`✅ Autoviewstatus is already ${value.toUpperCase()}.`);
            }
            settings.autoviewstatus = action;
            await settings.save();
            const statusText = action ? 'ON. Bot will autoview status update.' : 'OFF.';
            await m.reply(`✅ Autoviewstatus has been turned ${statusText}`);
        } else {
            await m.reply(`📄 Current autoviewstatus setting: ${settings.autoviewstatus ? 'ON' : 'OFF'}\n\nUse "autoviewstatus on" or "autoviewstatus off".`);
        }
    });
};