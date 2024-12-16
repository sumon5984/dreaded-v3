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
      console.log(`Not a group JID: ${jid}`);
      return null; // Return null or handle non-group cases differently
    }

    await connectToDB();
    let groupSettings = await GroupSettings.findOne({ jid });

    if (!groupSettings) {
      console.log(`Group settings not found for ${jid}, creating new settings.`);
      groupSettings = new GroupSettings({ jid });
      await groupSettings.save();
      console.log(`Created new group settings for ${jid}`);
    } else {
      console.log(`Fetched group settings for ${jid}`);
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