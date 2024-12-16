const ownerMiddleware = require('../../Middleware/ownerMiddleware'); 
const { getSettings } = require('../../Mongodb/Settingsdb');

module.exports = async (context) => {
  await ownerMiddleware(context, async () => {
    const { m, args } = context;

    let numberToAdd;

    if (m.quoted) {
      numberToAdd = m.quoted.sender.split('@')[0];
    } else if (m.mentionedJid && m.mentionedJid.length > 0) {
      numberToAdd = m.mentionedJid[0].split('@')[0];
    } else {
      numberToAdd = args[0];
    }

    if (!numberToAdd || !/^\d+$/.test(numberToAdd)) {
      return await m.reply('❌ Please provide a valid number or quote a user.');
    }

    let settings = await getSettings();
    if (!settings) {
      const Settings = require('../../Mongodb/Schemas/settingsSchema');
      settings = new Settings();
      await settings.save();
    }

    const currentDevs = settings.dev.split(',').map((num) => num.trim());

    if (currentDevs.includes(numberToAdd)) {
      return await m.reply('⚠️ This number is already a sudo user.');
    }

    currentDevs.push(numberToAdd);
    settings.dev = currentDevs.join(',');
    await settings.save();

    await m.reply(`✅ ${numberToAdd} has been added as a Sudo User.`);
  });
};