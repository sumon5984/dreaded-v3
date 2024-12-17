module.exports = async (context) => {
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

await client.sendMessage(dest, { image: { url: avatar}, caption: fnn}, { quoted: m}) 


})

}
        