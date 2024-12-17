module.exports = async (context) => {

const ownerMiddleware = require('../../Middleware/ownerMiddleware');

    await ownerMiddleware(context, async () => {

    const { client, m, text} = context;

if (!text) {
      m.reply("Provide a setting to be updated. Example:\nlastseen all");
      return;
    }


const availablepriv = ['all', 'contacts', 'contact_blacklist', 'none'];

if (!availablepriv.includes(text)) return m.reply(`Choose a setting from this list: ${availablepriv.join('/')}`);

await client.updateLastSeenPrivacy(priv)
        await m.reply(`Last seen privacy settings updated to *${priv}*`);

})

}

