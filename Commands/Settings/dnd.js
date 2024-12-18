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
            if (settings.dnd) {
                return await m.reply('✅ Do Not Disturb mode was already ON.');
            }
            settings.dnd = true;
           
            settings.anticall = 'reject'
           
settings.mode = 'private';
            await settings.save();
            await m.reply('✅ Do Not Disturb mode has been turned ON.\nThe bot will now switch itself to private mode and will be managing this account.\n\nDuring this time, the bot will respond to personal messages  appropriately using AI, informing users of your unavailability.\n\nIncoming calls will be politely rejected.');
        } else if (value === 'off') {
            if (!settings.dnd) {
                return await m.reply('✅ Do Not Disturb mode was already OFF.');
            }
            settings.dnd = false;

            settings.anticall = 'off';
          
settings.mode = 'public';
            await settings.save();
            await m.reply('❌ Do Not Disturb mode has been turned OFF. You can now revert back to your custom settings.');
        } else {
            await m.reply(`📄 Current Do Not Disturb setting: ${settings.dnd ? 'ON' : 'OFF'}\n\nUse "dnd on" or "dnd off".`);
        }
    });
};