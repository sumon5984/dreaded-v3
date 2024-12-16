const { connectToDB } = require('./loadDb');
const Settings = require('./Schemas/settingsSchema');
const GroupSettings = require('./Schemas/groupSettingsSchema');

const getSettings = async () => {
  try {
    await connectToDB();
    const settings = await Settings.findOne();
    return settings;
  } catch (error) {
    console.error('Error fetching settings:', error.message);
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
      
      groupSettings = new GroupSettings({ jid });
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