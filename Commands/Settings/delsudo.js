const ownerMiddleware = require('../../Middleware/ownerMiddleware');
const { getSettings } = require('../../Mongodb/Settingsdb'); 

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { m, args } = context;

        let numberToRemove;

        if (m.quoted) {
            numberToRemove = m.quoted.sender.split('@')[0];
        } else if (m.mentionedJid && m.mentionedJid.length > 0) {
            numberToRemove = m.mentionedJid[0].split('@')[0];
        } else {
            numberToRemove = args[0];
        }

        if (!numberToRemove || !/^\d+$/.test(numberToRemove)) {
            return await m.reply('❌ Please provide a valid number or quote a user.');
        }

        
        let settings = await getSettings();
        if (!settings) {
            const Settings = require('../../Mongodb/Schemas/settingsSchema'); 
            settings = new Settings();
            await settings.save();
        }

        const currentDevs = settings.dev.split(',').map((num) => num.trim());

        if (!currentDevs.includes(numberToRemove)) {
            return await m.reply('⚠️ This number is not a sudo user.');
        }

        settings.dev = currentDevs.filter((num) => num !== numberToRemove).join(',');
        await settings.save();

        await m.reply(`✅ ${numberToRemove} has been removed from Sudo Users.`);
    });
};