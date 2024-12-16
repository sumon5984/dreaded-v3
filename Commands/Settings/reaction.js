const { getSettings } = require('../../Mongodb/Settingsdb');
const ownerMiddleware = require('../../Middleware/ownerMiddleware');


const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { m, args } = context;
        const newEmoji = args[0];

        let settings = await getSettings();

        if (!settings) {
            const Settings = require('../../Mongodb/Schemas/settingsSchema');
            settings = new Settings();
            await settings.save();
        }

        if (newEmoji) {
           
            if (!emojiRegex.test(newEmoji)) {
                return await m.reply(`❌ Invalid emoji. Please provide a valid emoji.`);
            }

            if (newEmoji === 'random') {
                if (settings.reactEmoji === 'random') {
                    return await m.reply(`✅ The bot is already set to react with random emojis on status!`);
                }
                settings.reactEmoji = "random";
                await settings.save();
                await m.reply(`✅ Status react emoji has been updated to random, bot will react with a random emoji.`);
            } else {
                if (settings.reactEmoji === newEmoji) {
                    return await m.reply(`✅ Status react emoji was already set to: ${newEmoji}`);
                }
                settings.reactEmoji = newEmoji;
                await settings.save();
                await m.reply(`✅ Status react emoji has been updated to: ${newEmoji}`);
            }
        } else {
            await m.reply(`📄 Current Status reaction emoji: ${settings.reactEmoji || 'No react emoji set.'}\n\nUse 'reaction random' to set it to random or 'reaction <emoji>' to set a specific emoji.`);
        }
    });
};