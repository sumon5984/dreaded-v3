const ownerMiddleware = require('../../Middleware/ownerMiddleware'); 

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, Owner } = context;


  
 await m.reply("Restarting. . .");
  
  process.exit()  



})

}