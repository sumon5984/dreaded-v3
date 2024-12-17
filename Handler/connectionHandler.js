const { Boom } = require("@hapi/boom");
const pino = require("pino");
const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });
const { getSettings } = require("../Mongodb/Settingsdb");
const { connectToDB } = require('../Mongodb/loadDb');
const { commands, totalCommands } = require('./commandHandler');
const { DateTime } = require("luxon");
const { useMultiFileAuthState, default: dreadedConnect, DisconnectReason } = require("@whiskeysockets/baileys");
const pino = require("pino");

let client; // Define client globally

async function startDreaded() {
  const settingss = await getSettings();
  const { saveCreds, state } = await useMultiFileAuthState(`Session`);

  // Initialize client and assign globally
  client = dreadedConnect({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    version: [2, 3000, 1015901307],
    browser: [`DREADED`, 'Safari', '3.0'],
    fireInitQueries: false,
    shouldSyncHistoryMessage: true,
    downloadHistory: true,
    syncFullHistory: true,
    generateHighQualityLinkPreview: true,
    markOnlineOnConnect: true,
    keepAliveIntervalMs: 30_000,
    auth: state,
    getMessage: async (key) => {
      if (store) {
        const mssg = await store.loadMessage(key.remoteJid, key.id);
        return mssg.message || undefined;
      }
      return { conversation: "HERE" };
    }
  });

  console.log("🔗 Client initialized successfully.");
}

  store.bind(client.ev);

        setInterval(() => { store.writeToFile("store.json"); }, 3000);


async function connectionHandler(update) {
  const { connection, lastDisconnect } = update;

  const getGreeting = () => {
    const currentHour = DateTime.now().setZone('Africa/Nairobi').hour;
    if (currentHour >= 5 && currentHour < 12) return 'Good morning 🌄';
    if (currentHour >= 12 && currentHour < 18) return 'Good afternoon ☀️';
    if (currentHour >= 18 && currentHour < 22) return 'Good evening 🌆';
    return 'Good night 😴';
  };

  const getCurrentTimeInNairobi = () => {
    return DateTime.now().setZone('Africa/Nairobi').toLocaleString(DateTime.TIME_SIMPLE);
  };

  if (connection === "close") {
    let reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
    if (reason === DisconnectReason.badSession) {
      console.log(`Bad Session File, Please Delete Session and Scan Again`);
      process.exit();
    } else if (reason === DisconnectReason.connectionClosed) {
      console.log("Connection closed, reconnecting....");
      await startDreaded();
    } else if (reason === DisconnectReason.connectionLost) {
      console.log("Connection Lost from Server, reconnecting...");
      await startDreaded();
    } else if (reason === DisconnectReason.loggedOut) {
      console.log(`Device Logged Out, Please Delete File creds.json and Scan Again.`);
      process.exit();
    } else if (reason === DisconnectReason.restartRequired) {
      console.log("Restart Required, Restarting...");
      await startDreaded();
    } else {
      console.log(`Unknown DisconnectReason: ${reason}`);
      await startDreaded();
    }
  } else if (connection === "open") {
    try {
      console.log("📈 Connecting to database...");
      await connectToDB();
      console.log("📉 Connected to MongoDB database.");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error.message);
    }

    const Myself = await client.decodeJid(client.user.id);
    const botNumber = Myself.split('@')[0];
    const set = await getSettings();
    const currentDevs = set.dev.split(',').map((num) => num.trim());

    if (!currentDevs.includes(botNumber)) {
      currentDevs.push(botNumber);
      set.dev = currentDevs.join(',');
      await set.save();

      const newSudoMessage = `Holla, ${getGreeting()},\n\nYou are connected to dreaded bot. 📡 \n\n`
        + `👤 BOTNAME:- ${process.env.BOTNAME || set.botname}\n`
        + `🔓 MODE:- ${set.mode}\n`
        + `✍️ PREFIX:- ${set.prefix}\n`
        + `📝 COMMANDS:- ${totalCommands}\n`
        + `🕝 TIME:- ${getCurrentTimeInNairobi()}\n💡 LIBRARY:- Baileys\n\n▞▚▞▚▞▚▞▚▞▚`;

      await client.sendMessage(client.user.id, { text: newSudoMessage });
    } else {
      console.log("Connection successful. Bot is active.");
    }
  }
}

module.exports = {
  connectionHandler,
  startDreaded,
  getClient: () => client
};







/* const { Boom } = require("@hapi/boom");

const { getSettings } = require("../Mongodb/Settingsdb"); 
const { connectToDB } = require('../Mongodb/loadDb');
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

try {
  await console.log("📈 Connecting to database...");
  await connectToDB();
  await console.log("📉 Connected to MongoDB database.");
} catch (error) {
  console.error("Error connecting to MongoDB:", error.message);
  
}

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

await console.log("🪀 Trying to make a connection to WhatsApp. . .");

    console.log(`✅ Connection successful\nLoaded ${totalCommands} commands.\nBot is active`);
  }
}

module.exports = connectionHandler; */