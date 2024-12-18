const ownerMiddleware = require('../../Middleware/ownerMiddleware'); 

module.exports = async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args, participants } = context;

                 if (!m.isGroup) return m.reply("This command is meant for groups.");

    if (!args || !args[0]) {
      return m.reply('Provide a country code to cast your message.');
    }

    const mycode = args[0];
    let bcmsg = args.slice(1).join(' ');

    if (!bcmsg) {
      if (m.quoted) {
        bcmsg = m.quoted.text;
      } else {
        return m.reply('Provide a message text after the code. Currently we support texts only.');
      }
    }

    let member = participants
  .map(v => v.id)
  .filter(v => v.startsWith(mycode) && v !== client.decodeJid(client.user.id));


    if (member.length === 0) {
      return m.reply('No members with the specified country code found.');
    }

    let warningMessage = `⚠️ The bot is about to send given message to ${member.length} participants with the specified country code.\n\nThis may be considered spam by WhatsApp and could result in bans. Proceed with caution.`;
    await m.reply(warningMessage);

    setTimeout(() => {
      for (let mem of member) {
        client.sendMessage(mem, { text: bcmsg });
      }

      m.reply("✅ Done. Message sent to all members with the specified country code.");
    }, 3000);
  });
};