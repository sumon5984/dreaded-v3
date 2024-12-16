const middleware = require('../../Middleware/adminMiddleware');

module.exports = async (context) => {
    await middleware(context, async () => {
        const { client, m } = context;

        await client.groupSettingUpdate(m.chat, 'announcement');
        m.reply('Group closed.');
    });
};