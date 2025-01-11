const ownerMiddleware = require('../../Middleware/ownerMiddleware'); 

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
    

        const { client, m, args, participants, text } = context;


if (!m.isGroup) return m.reply('Command meant for groups');



client.sendMessage(m.chat, { text : text ? text : 'Attention here' , mentions: participants.map(a => a.id)}, { quoted: m });

});

}