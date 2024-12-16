const middleware = require('../../Middleware/adminMiddleware');

module.exports = async (context) => {
    await middleware(context, async () => {
        const { client, m, args, participants, text } = context;






client.sendMessage(m.chat, { text : text ? text : '☞︎︎︎ TAGGED ☜︎︎︎' , mentions: participants.map(a => a.id)}, { quoted: m });

});

}

