module.exports = async (context) => {

const ownerMiddleware = require('../../Middleware/ownerMiddleware');
    await ownerMiddleware(context, async () => {

    const { client, m } = context;
    
    const {
                readreceipts,
                profile,
                status,
                online,
                last,
                groupadd,
                calladd
        } = await client.fetchPrivacySettings(true);
        
        const fnn = `*Current Privacy settings*

* Name :* ${client.user.name}
* Online:* ${online}
* Profile picture :* ${profile}
* Last seen :* ${last}
* Read receipt :* ${readreceipts}
* Group add :* ${groupadd}
* Call add :* ${calladd}`;


const avatar = await client.profilePictureUrl(idBot, 'image').catch(_ => 'https://telegra.ph/file/b34645ca1e3a34f1b3978.jpg');

await client.sendMessage(m.chat, { image: { url: avatar}, caption: fnn}, { quoted: m}) 


})

}
        