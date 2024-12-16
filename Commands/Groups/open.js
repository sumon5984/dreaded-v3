const middleware = require('../../Middleware/adminMiddleware');


module.exports = async (context) => {
    await middleware(context, async () => {
        const { client, m } = context;

        await client.groupSettingUpdate(m.chat, 'not_announcement');
        m.reply('Group opened.');
    });
};