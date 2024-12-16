const { getSettings } = require('../../Mongodb/Settingsdb'); 
const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware'); 

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args } = context;

      
        let settings = await getSettings();

        if (!settings) {
            const Settings = require('../../Mongodb/Schemas/settingsSchema');
            settings = new Settings();
            await settings.save();
        }

        const value = args[0]?.toLowerCase();

        if (value === 'on') {
            
            settings.autobio = true;
            await settings.save();
            await m.reply('✅ Autobio has been turned ON. Bot will auto update about every 10 seconds.');
        } else if (value === 'off') {
            
            settings.autobio = false;
            await settings.save();
            await m.reply('❌ Autobio has been turned OFF.');
        } else {
           
            await m.reply(`📄 Current autobio setting: ${settings.autobio ? 'ON' : 'OFF'}\n\nUse "autobio on" or "autobio off".`);
        }
    });
};