const middleware = require('../../Middleware/adminMiddleware');

module.exports = async (context) => {
  await middleware(context, async () => {
    const { client, m, args, participants } = context;

    
    if (!args || !args[0]) {
      return m.reply('Provide a specific country code. Bot will remove all members with that code.');
    }

    
    const mycode = args[0];

    
    let member = participants.filter(v => !v.admin)
      .map(v => v.id)
      .filter(v => v.startsWith(mycode) && v !== client.decodeJid(client.user.id));

   
    if (member.length === 0) {
      return m.reply('No members with the specified country code found.');
    }

   
    setTimeout(() => {
      client.groupParticipantsUpdate(m.chat, member, 'remove');

      setTimeout(() => {
        m.reply(`✅ Done. All +${mycode} members have been removed.`);
      }, 1000);
    }, 1000);
  });
};