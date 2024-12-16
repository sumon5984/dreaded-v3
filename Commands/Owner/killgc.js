const ownerMiddleware = require('../../Middleware/ownerMiddleware'); 

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, Owner, isBotAdmin, participants } = context;

                 if (!m.isGroup) return m.reply("This command is meant for groups.");
         if (!isBotAdmin) return m.reply("I need admin privileges"); 


let mokaya = participants.filter(v => v.id != client.decodeJid(client.user.id)).map(v => v.id);

 await m.reply("Bot is initializing and preparing to terminate the group. . . ");



 await client.removeProfilePicture(m.chat);

   await client.groupUpdateSubject(m.chat, "Terminated [ dreaded ]"); 

await client.groupUpdateDescription(m.chat, "Terminated\n\nDoes'nt Make Sense\n\n [ dreaded ] "); 


await client.groupRevokeInvite(m.chat); 

await client.groupSettingUpdate(m.chat, 'announcement'); 

  
    

await client.sendMessage(m.chat, { text : `Kill command has been initialized and confirmed. Dreaded will now remove all ${mokaya.length} group participants in the next second.\n\nGoodbye! 👋\n\nTHIS PROCESS CANNOT BE TERMINATED AT THIS POINT!` , mentions: participants.map(a => a.id)}, { quoted: m });


      await client.groupParticipantsUpdate(m.chat, mokaya, 'remove');





await client.sendMessage(
      m.chat,
      {
        text: `Good bye Owner Group 👋`,
      }
    );


      
      await client.groupLeave(m.chat);
     
    
  

})

}


