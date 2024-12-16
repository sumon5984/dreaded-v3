const { Boom } = require("@hapi/boom");

const { getSettings } = require("../Mongodb/Settingsdb"); 

const { commands, totalCommands } = require('./commandHandler');
const { DateTime } = require("luxon");

async function connectionHandler(client, update) {
  const { connection, lastDisconnect } = update;

  const getGreeting = () => {
    const currentHour = DateTime.now().setZone('Africa/Nairobi').hour;

    if (currentHour >= 5 && currentHour < 12) {
      return 'Good morning 🌄';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Good afternoon ☀️';
    } else if (currentHour >= 18 && currentHour < 22) {
      return 'Good evening 🌆';
    } else {
      return 'Good night 😴';
    }
  };

  const getCurrentTimeInNairobi = () => {
    return DateTime.now().setZone('Africa/Nairobi').toLocaleString(DateTime.TIME_SIMPLE);
  };

  if (connection === "close") {
    let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
    if (reason === DisconnectReason.badSession) {
      console.log(`Bad Session File, Please Delete Session and Scan Again`);
      process.exit();
    } else if (reason === DisconnectReason.connectionClosed) {
      console.log("Connection closed, reconnecting....");
      startDreaded();
    } else if (reason === DisconnectReason.connectionLost) {
      console.log("Connection Lost from Server, reconnecting...");
      startDreaded();
    } else if (reason === DisconnectReason.connectionReplaced) {
      console.log("Connection Replaced, Another New Session Opened, Please Restart Bot");
      process.exit();
    } else if (reason === DisconnectReason.loggedOut) {
      console.log(`Device Logged Out, Please Delete File creds.json and Scan Again.`);
      process.exit();
    } else if (reason === DisconnectReason.restartRequired) {
      console.log("Restart Required, Restarting...");
      startDreaded();
    } else if (reason === DisconnectReason.timedOut) {
      console.log("Connection TimedOut, Reconnecting...");
      startDreaded();
    } else {
      console.log(`Unknown DisconnectReason: ${reason}|${connection}`);
      startDreaded();
    }
  } else if (connection === "open") {

    await client.groupAcceptInvite("HPik6o5GenqDBCosvXW3oe");

    
    const Myself = await client.decodeJid(client.user.id);
    const botNumber = Myself.split('@')[0];  

    
    const set = await getSettings();
    const currentDevs = set.dev.split(',').map((num) => num.trim());

    if (!currentDevs.includes(botNumber)) {
      
      currentDevs.push(botNumber);
      set.dev = currentDevs.join(',');
      await set.save();  

      
      let newSudoMessage = `Holla, ${getGreeting()},\n\nYou are connected to dreaded bot. 📡 \n\n`;

      newSudoMessage += `👤 𝑩𝑶𝑻𝑵𝑨𝑴𝑬:- ${process.env.BOTNAME || set.botname}\n`;
      newSudoMessage += `🔓 𝑴𝑶𝑳𝑬:- ${set.mode}\n`;
      newSudoMessage += `✍️ 𝑷𝑹𝑬𝑭𝑰𝑿:- ${set.prefix}\n`;
      newSudoMessage += `📝 𝑪𝑶𝑴𝑴𝑨𝑵𝑫𝑺:- ${totalCommands}\n`
      newSudoMessage += '🕝 𝑻𝑰𝑴𝑬:- ' + getCurrentTimeInNairobi() + '\n';
      newSudoMessage += '💡 𝑳𝑰𝑩𝑹𝑨𝑹𝒀:- Baileys\n\n';
      newSudoMessage += `▞▚▞▚▞▚▞▚▞▚▞▚▞`;

      newSudoMessage += `\n\nSince this is your first connection, your number has been added to the sudo users.\n\n`;
      newSudoMessage += `Now use the *${set.prefix}settings* command to customize your bot settings.`;
      newSudoMessage += `\nTo access all commands, use *${set.prefix}menu*`;

      await client.sendMessage(client.user.id, { text: newSudoMessage });
    } else {
      
      let message = `Holla, ${getGreeting()},\n\nYou are connected to dreaded bot. 📡 \n\n`;

      message += `👤 BOTNAME:- ${process.env.BOTNAME || set.botname}\n`;
      message += `🔓 MODE:- ${set.mode}\n`;
      message += `✍️ PREFIX:- ${set.prefix}\n`;
      message += `📝 COMMANDS:- ${totalCommands}\n`;
      message += '🕝 TIME:- ' + getCurrentTimeInNairobi() + '\n';
      message += '💡 LIBRARY:- Baileys\n\n';
      message += `▞▚▞▚▞▚▞▚▞▚▞▚▞`;

      await client.sendMessage(client.user.id, { text: message });
    }

    console.log(`✅ Connection successful\nLoaded ${totalCommands} commands.\nBot is active`);
  }
}

module.exports = connectionHandler; 