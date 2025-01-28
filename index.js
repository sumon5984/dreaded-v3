
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

const { readFileSync } = require('fs'); 
const { join } = require('path'); 


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
const connectionHandler = require('./Handler/connectionHandler');

const handleCall = require('./Handler/callHandler');


const { connectToDB } = require('./Mongodb/loadDb');
const { smsg } = require('./Handler/smsg.js');
const botname = process.env.BOTNAME || 'Dreaded';


const authenticationn = require('./Auth/auth.js');
const { DateTime } = require('luxon');



authenticationn();
const mongoose = require("mongoose");



 async function startDreaded() {
      await connectToDB();

const settingss = await getSettings();



const { autobio, mode, prefix, presence, anticall } = settingss;






        const {  saveCreds, state } = await useMultiFileAuthState(`Session`)
            const client = dreadedConnect({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
version: [2, 3000, 1015901307],
        browser: [`DREADED`,'Safari','3.0'],
fireInitQueries: false,
            shouldSyncHistoryMessage: false,
            downloadHistory: false,
            syncFullHistory: false,
            generateHighQualityLinkPreview: true,
            markOnlineOnConnect: false,
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
  const settingsss = await getSettings(); 
  await handleCall(client, json, settingsss, handleCallAndBan);
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


  client.public = true;

  client.serializeM = (m) => smsg(client, m, store);


  client.ev.on("group-participants.update", async (m) => {
    eventHandler2(client, m);

eventHandler(client, m);
  });



client.ev.on("connection.update", async (update) => {
  await connectionHandler(client, update, startDreaded);
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


app.use(express.static('Public'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html'); 
});


app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));



startDreaded().catch(console.error);

 