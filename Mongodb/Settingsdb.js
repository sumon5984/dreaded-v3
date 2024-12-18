const { connectToDB } = require('./loadDb');
const Settings = require('./Schemas/settingsSchema');
const GroupSettings = require('./Schemas/groupSettingsSchema');

const getSettings = async () => {
  try {
    await connectToDB();
    
    let settings = await Settings.findOne();
    if (!settings) {
      
      settings = new Settings({
        autoread: true,
        autoviewstatus: true,
        autolikestatus: true,
        autobio: false,
        anticall: false,
        antionce: true,
        dnd: false,
        presence: 'online',
        prefix: '.',
        reactEmoji: '❤️',
        packname: 'dreaded-v3 fortunatus',
        dev: '254114018035',
        DevDreaded: ['254114018035'],
        botname: 'DREADED',
        mode: 'public',
      });
      await settings.save();
    }
    return settings;
  } catch (error) {
    console.error('Error fetching or creating settings:', error.message);
  }
};
const getGroupSettings = async (jid) => {
  try {
    if (!jid.endsWith('@g.us')) {
      return null; 
    }

    await connectToDB();
    let groupSettings = await GroupSettings.findOne({ jid });

    if (!groupSettings) {
      
      groupSettings = new GroupSettings({
        jid,
        antilink: false,
        antispam: false,
        antidelete: true,
        events: true,
        antitag: true,
        gcpresence: true,
        antiforeign: true,
        antidemote: false,
        antipromote: false,
        updatedAt: Date.now(),
      });
      await groupSettings.save();
    }

    return groupSettings;
  } catch (error) {
    console.error('Error fetching or creating group settings:', error.message);
  }
};


module.exports = {
  getSettings,
  getGroupSettings,
};