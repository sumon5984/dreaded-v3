const ownerMiddleware = require('../../Middleware/ownerMiddleware'); 

const { getSettings } = require('../../Mongodb/Settingsdb');

module.exports = async (context) => {
  await ownerMiddleware(context, async () => {
    const { m } = context;

    let settings = await getSettings();
    if (!settings) {
      const Settings = require('../../Mongodb/Schemas/settingsSchema');
      settings = new Settings();
      await settings.save();
    }

    const currentDevs = settings.dev.split(',').map((num) => num.trim());

    if (currentDevs.length === 0) {
      return await m.reply('⚠️ No Sudo Users found.');
    }

    await m.reply(`📄 Current Sudo Users:\n\n${currentDevs.map((num) => `- ${num}`).join('\n')}`);
  });
};