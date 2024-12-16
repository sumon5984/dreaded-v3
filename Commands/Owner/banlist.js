const ownerMiddleware = require('../../Middleware/ownerMiddleware'); 

  const { getBannedUsers } = require('../../Mongodb/Userdb');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {

    const { client, m } = context;

    try {
        const { bannedCount, bannedUsers } = await getBannedUsers();
        
        if (bannedCount === 0) {
            await m.reply('There are no banned users.');
            return;
        }

        let bannedListMessage = 'BANNED USERS 🚫\n\n';
        bannedUsers.forEach((user, index) => {
            const jidNumber = user.jid.replace('@s.whatsapp.net', '');
            const waLink = `wa.me/${jidNumber}`;

            const reason = user.banReason || 'No reason provided';
            let banMessage = 'No reason in database';
            
            if (reason === 'sudoBan') {
                banMessage = 'Banned by a Sudo';
            } else if (reason === 'spamming') {
                banMessage = 'Reckless spamming';
            } else if (reason === 'calling') {
                banMessage = 'Calling the bot';
            }

            bannedListMessage += `${index + 1}. ${waLink}\nReason: ${banMessage}\n\n`;
        });

        await m.reply(bannedListMessage);
    } catch (error) {
        console.error('Error fetching banned users:', error.message);
        await m.reply('An error occurred while fetching the banned users.');
    }

    
});

}

  
                    
                    
