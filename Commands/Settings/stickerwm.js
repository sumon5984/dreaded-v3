const { getSettings } = require('../../Mongodb/Settingsdb');
const ownerMiddleware = require('../../Middleware/ownerMiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { m, args } = context;
        const newStickerWM = args[0]; 
        let settings = await getSettings();

        if (!settings) {
            const Settings = require('../../Mongodb/Schemas/settingsSchema');
            settings = new Settings();
            await settings.save();
        }

        if (newStickerWM === 'null') {
            if (!settings.packname) {
                return await m.reply(`✅ The bot already has no sticker watermark.`);
            }
            settings.packname = "";
            await settings.save();
            await m.reply(`✅ The bot now has no sticker watermark.`);
        } else if (newStickerWM) {
            if (settings.packname === newStickerWM) {
                return await m.reply(`✅ The sticker watermark was already set to: ${newStickerWM}`);
            }
            settings.packname = newStickerWM;
            await settings.save();
            await m.reply(`✅ Sticker watermark has been updated to: ${newStickerWM}`);
        } else {
            await m.reply(`📄 Current sticker watermark: ${settings.stickerwm || ''}\n\nUse 'stickerwm null' to remove the watermark or 'stickerwm <text>' to set a specific watermark.`);
        }
    });
};