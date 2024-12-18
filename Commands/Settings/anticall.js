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

        if (value === 'reject') {
            if (settings.anticall === 'reject') {
                return await m.reply('✅ Anti-call was already set to REJECT.');
            }
            settings.anticall = 'reject';
            await settings.save();
            await m.reply('✅ Anti-call has been set to REJECT. Calls will now be politely rejected.');
        } else if (value === 'block') {
            if (settings.anticall === 'block') {
                return await m.reply('✅ Anti-call was already set to BLOCK.');
            }
            settings.anticall = 'block';
            await settings.save();
            await m.reply('✅ Anti-call has been set to BLOCK. Calls will now be REJECTED and the caller blocked and banned.');
        } else if (value === 'off') {
            if (settings.anticall === 'off') {
                return await m.reply('✅ Anti-call was already OFF.');
            }
            if (settings.dnd) {
                return await m.reply('Do Not Disturb mode is active and anticall cannot be disabled. Please exit DND mode first.');
            }
            settings.anticall = 'off';
            await settings.save();
            await m.reply('❌ Anti-call has been turned OFF.');
        } else {
            await m.reply(
                `📄 Current anti-call setting: ${settings.anticall?.toUpperCase() || 'OFF'}\n\n` +
                'Use "anticall reject", "anticall block", or "anticall off".'
            );
        }
    });
};