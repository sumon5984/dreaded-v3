const ownerMiddleware = require('../../Middleware/ownerMiddleware'); 

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, getGroupAdmins, botNumber, args } = context;

if (!text) return m.reply("Provide me a group link. Ensure bot is in that group with admin privileges!");

                let id;
let subject;

try {
  let result = args[0].split('https://chat.whatsapp.com/')[1];
  const info = await client.groupGetInviteInfo(result);
  ({ id, subject } = info);
} catch (error) {
  m.reply("Am failing to get the metadata of given group, provide a valid group link.");
return;
}

try {

const groupMetadata = await client.groupMetadata(id);

const participants = await groupMetadata.participants; 


let mokaya = participants.filter(v => v.id != client.decodeJid(client.user.id)).map(v => v.id);

 await m.reply(`🟩 Initializing and preparing to kill the group ${subject}`);

 await client.removeProfilePicture(id);

   await client.groupUpdateSubject(id, "Terminated [ dreaded ]"); 

await client.groupUpdateDescription(id, "Terminated\n\nDoesnt Make Sense\n\n [ dreaded ] "); 


await client.groupRevokeInvite(id); 

await client.groupSettingUpdate(id, 'announcement'); 

await client.sendMessage(id, { text : `At this time, my owner has initiated kill command remotely.  All ${mokaya.length} group participants will be removed.\n\nGoodbye! 👋\n\nTHIS PROCESS CANNOT BE TERMINATED !` , mentions: participants.map(a => a.id)});


      await client.groupParticipantsUpdate(id, mokaya, 'remove');

await client.sendMessage(
      id,
      {
        text: `Good bye Owner Group 👋\n\nIts too cold in here! 🥶`,
      }
    );

  await client.groupLeave(id);

await m.reply("Successfully Killed! 🎭");

} catch (error) {

m.reply("Kill command failed, bot is either not in that group, or not an admin.")
}

})

}

