const ownerMiddleware = require('../../Middleware/ownerMiddleware'); 

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, Owner } = context;

const { exec } = require('child_process');

exec('node index.js', (err, stdout, stderr) => {
  if (err) {

m.reply('Error occured\n' + err)
    console.error(err);
    return;
  } else { 

m.reply("Restarting. . .")
console.log(stdout);

}

  
});

})

}