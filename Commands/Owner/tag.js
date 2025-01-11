const ownerMiddleware = require('../../Middleware/ownerMiddleware'); 

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
    

        const { client, m, args, participants, text } = context;






client.sendMessage(m.chat, { text : text ? text : '☞︎︎︎ TAGGED ☜︎︎︎' , mentions: participants.map(a => a.id)}, { quoted: m });

});

}