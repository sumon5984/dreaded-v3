const middleware = require('../../Middleware/adminMiddleware');

module.exports = async (context) => {
    await middleware(context, async () => {
        const { client, m, args, participants, mycode } = context;


  let member = participants.filter(v => !v.admin).map(v => v.id).filter(v => !v.startsWith(mycode) && v != client.decodeJid(client.user.id));


if (!args || !args[0]) {
  if (member.length == 0) return m.reply(`No foreigners detected.`);

  let txt = `Foreigners are members whose country code is not ${mycode}. The following ${member.length} foreigners were found:- \n`;
  for (let mem of member) {
    txt += `🚫 @${mem.split('@')[0]}\n`;
  }
  txt += `\nTo remove them send .foreigners -x`;

  client.sendMessage(m.chat, { text: txt, mentions: member }, { quoted: m });



         } else if (args[0] == '-x') {

  setTimeout(() => {
    client.sendMessage(
      m.chat,
      {
        text: `Dreaded will now remove all ${member.length} foreigners from this group chat in the next second.\n\nGood bye Foreigners. 🥲`,
      },
      { quoted: m }
    );

setTimeout(() => {
      client.groupParticipantsUpdate(m.chat, member, 'remove');

      setTimeout(() => {
       m.reply("✅ Done. All foreigners removed.");
      }, 1000);
    }, 1000);
  }, 1000);

}
})

}

