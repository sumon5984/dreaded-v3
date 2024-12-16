const middleware = require('../../Middleware/adminMiddleware');


module.exports = async (context) => {
    await middleware(context, async () => {
        const { client, m } = context;

                 let response = await client.groupInviteCode(m.chat); 
                 client.sendText(m.chat, `https://chat.whatsapp.com/${response}\n\nGroup link!`, m, { detectLink: true }); 

});

}