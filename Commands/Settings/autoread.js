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
            settings.autoread = true;
            await settings.save();
            await m.reply('✅ Autoread has been turned ON. Bot will autoread messages!');
        } else if (value === 'off') {
            settings.autoread = false;
            await settings.save(); 
            await m.reply('❌ Autoread has been turned OFF.');
        } else {
            await m.reply(`📄 Current autoread setting: ${settings.autoread ? 'ON' : 'OFF'}\n\n Use "autoread on" or "autoread off".`);
        }
    });
};