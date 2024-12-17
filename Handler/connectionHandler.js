const {
  default: dreadedConnect,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  downloadContentFromMessage,
  jidDecode,
  proto,
  getContentType,
} = require("@whiskeysockets/baileys");

const { Boom } = require("@hapi/boom");
const pino = require("pino");
const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });
const { getSettings } = require("../Mongodb/Settingsdb");
const { connectToDB } = require('../Mongodb/loadDb');
const { commands, totalCommands } = require('./commandHandler');
const { DateTime } = require("luxon");

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

  // Bind the store to client events after initialization

  
  store.bind(client.ev);

client.ev.on("creds.update", saveCreds);
  setInterval(() => { store.writeToFile("store.json"); }, 3000);
}

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


      console.log("Connection successful. Bot is active.");
    
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
    } 
  }
}

  

module.exports = {
  connectionHandler,
  startDreaded,
saveCreds: (state) => state.saveCreds,
  getClient: () => client
};