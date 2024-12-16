const ownerMiddleware = require('../../Middleware/ownerMiddleware');
const { getSettings } = require('../../Mongodb/Settingsdb');
const { getUser, createUser } = require('../../Mongodb/Userdb');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { m, args } = context;

        let settings = await getSettings();
        if (!settings) {
            const Settings = require('../../Mongodb/Schemas/settingsSchema');
            settings = new Settings();
            await settings.save();
        }

        const sudoUsers = settings.dev.split(',').map((num) => `${num.trim()}@s.whatsapp.net`);

        let numberToBan;

        if (m.quoted) {
            numberToBan = m.quoted.sender;
        } else if (m.mentionedJid && m.mentionedJid.length > 0) {
            numberToBan = m.mentionedJid[0];
        } else {
            numberToBan = args[0];
        }

        if (!numberToBan) {
            return await m.reply('❌ Please provide a valid number or quote a user.');
        }

        if (!numberToBan.includes('@s.whatsapp.net')) {
            numberToBan = `${numberToBan.trim()}@s.whatsapp.net`;
        }

        if (sudoUsers.includes(numberToBan)) {
            return await m.reply('❌ Why do you want to ban a Sudo User?');
        }

        let user = await getUser(numberToBan);
        if (!user) {
            user = await createUser(numberToBan);
        }

        if (user.banned) {
            return await m.reply('⚠️ This user is already banned.');
        }

        user.banned = true;
        user.banReason = 'sudoBan';
        await user.save();

        await m.reply(`✅ ${numberToBan.split('@')[0]} has been banned.`);
    });
};