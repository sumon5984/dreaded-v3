const fs = require('fs');
const { getUser, createUser, isUserBanned } = require('../Mongodb/Userdb');
const { getSettings } = require('../Mongodb/Settingsdb');
const { aliases } = require('../Handler/commandHandler'); 

module.exports = async (client, m) => {
    let settings = await getSettings();
    const { prefix } = settings;

    const body =
        m.mtype === "conversation"
            ? m.message.conversation
            : m.mtype === "imageMessage"
            ? m.message.imageMessage.caption
            : m.mtype === "extendedTextMessage"
            ? m.message.extendedTextMessage.text
            : "";

    const categories = fs.readdirSync('./Commands', { withFileTypes: true }).filter(dirent => dirent.isDirectory());
    const commandFiles = categories.flatMap(category => {
        const categoryPath = `./Commands/${category.name}`;
        return fs.readdirSync(categoryPath)
            .filter(file => file.endsWith('.js'))
            .map(file => file.replace('.js', '')); 
    });

    const commandName = body.startsWith(prefix) 
        ? body.slice(prefix.length).trim().split(/\s+/)[0].toLowerCase() 
        : null;

    const resolvedCommandName = aliases[commandName] || commandName;

    const cmd = body.startsWith(prefix) && (commandFiles.includes(resolvedCommandName));

    if (cmd) {
        const userId = m.sender;

        let user = await getUser(userId);
        if (!user) {
            user = await createUser(userId);
        }

        const banned = await isUserBanned(userId);
        if (banned) {
            const reason = user.banReason || 'No reason provided';
            let banMessage = 'You are banned from using the bot!';
            if (reason === 'sudoBan') {
                banMessage = 'You were banned from using bot commands by a sudo user!';
            } else if (reason === 'spamming') {
                banMessage = 'You were banned from using bot commands because you spammed!';
            } else if (reason === 'calling') {
                banMessage = 'You were banned from using bot commands because you called the bot!';
            }

            await m.reply(banMessage);
            return false;
        }

        return true;
    }

    return false;
};