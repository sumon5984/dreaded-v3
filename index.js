
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
const pino = require("pino");
const { Boom } = require("@hapi/boom");
const fs = require("fs");
 const FileType = require("file-type");
const { exec, spawn, execSync } = require("child_process");
const axios = require("axios");
const chalk = require("chalk");
const figlet = require("figlet");

const PhoneNumber = require("awesome-phonenumber");

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./Lib/Exif');
 const { isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep } = require('./Lib/Func');
const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });
const { commands, totalCommands } = require('./Handler/commandHandler');
const { getSettings } = require('./Mongodb/Settingsdb');
const messageHandler = require("./Handler/messageHandler");
const eventHandler = require("./Handler/eventHandler.js");
const eventHandler2= require("./Handler/eventHandler2.js");
const handleMessage = require("./Handler/messageHandler");
const { smsg } = require('./Handler/smsg.js');
const botname = process.env.BOTNAME || 'Dreaded';


const authenticationn = require('./Auth/auth.js');
const { DateTime } = require('luxon');



authenticationn();
const mongoose = require("mongoose");

 async function startDreaded() {


const settingss = await getSettings();

const { autoview, autoread, botname, autobio, mode, prefix, presence, anticall } = settingss;


        const {  saveCreds, state } = await useMultiFileAuthState(`Session`)
            const client = dreadedConnect({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
version: [2, 3000, 1015901307],
        browser: [`DREADED`,'Safari','3.0'],
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
                const mssg = await store.loadMessage(key.remoteJid, key.id)
                return mssg.message || undefined
            }
            return {
                conversation: "HERE"
            }
        }
    })

store.bind(client.ev);

setInterval(() => { store.writeToFile("store.json"); }, 3000);



if (settingss && settingss.autobio === true){ 
            setInterval(() => { 

                                 const date = new Date() 

                         client.updateProfileStatus( 

                                         `${botname} is active 24/7\n\n${date.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' })} It's a ${date.toLocaleString('en-US', { weekday: 'long', timeZone: 'Africa/Nairobi'})}.` 

                                 ) 

                         }, 10 * 1000) 

}




const { handleCallAndBan } = require('./Mongodb/Userdb');  

client.ws.on('CB:call', async (json) => {
  if (json.content[0].tag == 'offer') {
    const callCreator = json.content[0].attrs['call-creator'];

    
    if (settingss && settingss.anticall === true) {
      
      await handleCallAndBan(json, client);

      
      client.sendMessage(callCreator, { text: "You violated our terms of use and you will be banned." });
    } else {
      console.log('Anti-call is disabled, call is not being rejected.');
    }
  }
});


client.ev.on("messages.upsert", (chatUpdate) => {
  handleMessage(client, chatUpdate, store);
});

  
  client.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (decode.user && decode.server && decode.user + "@" + decode.server) || jid;
    } else return jid;
  };

  client.ev.on("contacts.update", (update) => {
    for (let contact of update) {
      let id = client.decodeJid(contact.id);
      if (store && store.contacts) store.contacts[id] = { id, name: contact.notify };
    }
  });


 client.getName = (jid, withoutContact = false) => {
    id = client.decodeJid(jid);
    withoutContact = client.withoutContact || withoutContact;
    let v;
    if (id.endsWith("@g.us"))
      return new Promise(async (resolve) => {
        v = store.contacts[id] || {};
        if (!(v.name || v.subject)) v = client.groupMetadata(id) || {};
        resolve(v.name || v.subject || PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber("international"));
      });
    else
      v =
        id === "0@s.whatsapp.net"
          ? {
              id,
              name: "WhatsApp",
            }
          : id === client.decodeJid(client.user.id)
          ? client.user
          : store.contacts[id] || {};
    return (withoutContact ? "" : v.name) || v.subject || v.verifiedName || PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber("international");
  };

  client.setStatus = (status) => {
    client.query({
      tag: "iq",
      attrs: {
        to: "@s.whatsapp.net",
        type: "set",
        xmlns: "status",
      },
      content: [
        {
          tag: "status",
          attrs: {},
          content: Buffer.from(status, "utf-8"),
        },
      ],
    });
    return status;
  };

  client.public = true;

  client.serializeM = (m) => smsg(client, m, store);


  client.ev.on("group-participants.update", async (m) => {
    eventHandler2(client, m);

eventHandler(client, m);
  });




 client.ev.on("connection.update", async (update) => {

await console.log("Trying to connect database and WhatsApp...");

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



    console.log(`✅ Connection successful\nLoaded ${totalCommands} commands.\nBot is active`);
  }
   
});


client.ev.on("creds.update", saveCreds);




  client.sendText = (jid, text, quoted = "", options) => client.sendMessage(jid, { text: text, ...options }, { quoted });

    client.downloadMediaMessage = async (message) => { 
         let mime = (message.msg || message).mimetype || ''; 
         let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]; 
         const stream = await downloadContentFromMessage(message, messageType); 
         let buffer = Buffer.from([]); 
         for await(const chunk of stream) { 
             buffer = Buffer.concat([buffer, chunk]) 
         } 

         return buffer 
      }; 


        client.sendImageAsSticker = async (jid, path, quoted, options = {}) => { 
         let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0); 
         // let buffer 
         if (options && (options.packname || options.author)) { 
             buffer = await writeExifImg(buff, options) 
         } else { 
             buffer = await imageToWebp(buff); 
         } 

         await client.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted }); 
         return buffer 
     }; 

 client.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
  let buff = Buffer.isBuffer(path)
    ? path
    : /^data:.*?\/.*?;base64,/i.test(path)
    ? Buffer.from(path.split(",")[1], "base64")
    : /^https?:\/\//.test(path)
    ? await (await getBuffer(path))
    : fs.existsSync(path)
    ? fs.readFileSync(path)
    : Buffer.alloc(0);

  let buffer;

  if (options && (options.packname || options.author)) {
    buffer = await writeExifVid(buff, options);
  } else {
    buffer = await videoToWebp(buff);
  }

  await client.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
  return buffer;
};


 client.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => { 
         let quoted = message.msg ? message.msg : message; 
         let mime = (message.msg || message).mimetype || ''; 
         let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]; 
         const stream = await downloadContentFromMessage(quoted, messageType); 
         let buffer = Buffer.from([]); 
         for await(const chunk of stream) { 
             buffer = Buffer.concat([buffer, chunk]); 
         } 
         let type = await FileType.fromBuffer(buffer); 
         const trueFileName = attachExtension ? (filename + '.' + type.ext) : filename; 
         // save to file 
         await fs.writeFileSync(trueFileName, buffer); 
         return trueFileName; 
     };
}


app.get("/", (req, res) => {
    res.send("Bot running now... ");
});
app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));



startDreaded().catch(console.error);

 