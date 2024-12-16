const { getGroupSettings } = require('../../Mongodb/Settingsdb');
const ownerMiddleware = require('../../Middleware/ownerMiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { m } = context;

        const jid = m.chat; 

        if (!jid.endsWith('@g.us')) {
            return await m.reply('❌ This command can only be used in groups.');
        }

        let groupSettings = await getGroupSettings(jid);

        if (!groupSettings) {
            const GroupSettings = require('../../Mongodb/Schemas/groupSettingsSchema');
            groupSettings = new GroupSettings({ jid });
            await groupSettings.save();
        }

        let response = `*Group Settings for ${jid}*\n`;
        response += `🔘 *Antilink*: ${groupSettings.antilink ? '✅ ON' : '❌ OFF'}\n`;
        response += `🔘 *Antidelete*: ${groupSettings.antidelete ? '✅ ON' : '❌ OFF'}\n`;
        response += `🔘 *Events*: ${groupSettings.events ? '✅ ON' : '❌ OFF'}\n`;
        response += `🔘 *Antitag*: ${groupSettings.antitag ? '✅ ON' : '❌ OFF'}\n`;
        response += `🔘 *GCPresence*: ${groupSettings.gcpresence ? '✅ ON' : '❌ OFF'}\n`;
        response += `🔘 *Antiforeign*: ${groupSettings.antiforeign ? '✅ ON' : '❌ OFF'}\n`;
        response += `🔘 *Antidemote*: ${groupSettings.antidemote ? '✅ ON' : '❌ OFF'}\n`;
        response += `🔘 *Antipromote*: ${groupSettings.antipromote ? '✅ ON' : '❌ OFF'}\n`;
        response += `🔘 *Antispam*: ${groupSettings.antispam ? '✅ ON' : '❌ OFF'}\n`; 

        await m.reply(response);
    });
};