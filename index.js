
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
const { connectionHandler, startDreaded, getClient } = require("./Handler/connectionHandler.js");
const handleMessage = require("./Handler/messageHandler");
const { smsg } = require('./Handler/smsg.js');
const botname = process.env.BOTNAME || 'Dreaded';


const authenticationn = require('./Auth/auth.js');
const { DateTime } = require('luxon');



authenticationn();
const mongoose = require("mongoose");

/* async function startDreaded() {


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


*/




async function main() {
  console.log("🚀 Starting Dreaded bot...");
  
  
  await startDreaded();
  
  const client = getClient(); // Now you can safely get the client



  const settingss = getSettings();
  

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

await console.log("Checking for connection update...");
  await connectionHandler(update);  
});


// client.ev.on("creds.update", saveCreds);


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



  client.cMod = (jid, copy, text = "", sender = client.user.id, options = {}) => {
    //let copy = message.toJSON()
    let mtype = Object.keys(copy.message)[0];
    let isEphemeral = mtype === "ephemeralMessage";
    if (isEphemeral) {
      mtype = Object.keys(copy.message.ephemeralMessage.message)[0];
    }
    let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message;
    let content = msg[mtype];
    if (typeof content === "string") msg[mtype] = text || content;
    else if (content.caption) content.caption = text || content.caption;
    else if (content.text) content.text = text || content.text;
    if (typeof content !== "string")
      msg[mtype] = {
        ...content,
        ...options,
      };
    if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
    else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
    if (copy.key.remoteJid.includes("@s.whatsapp.net")) sender = sender || copy.key.remoteJid;
    else if (copy.key.remoteJid.includes("@broadcast")) sender = sender || copy.key.remoteJid;
    copy.key.remoteJid = jid;
    copy.key.fromMe = sender === client.user.id;

    return proto.WebMessageInfo.fromObject(copy);
  };

  return client;


app.get("/", (req, res) => {
    res.send("Bot running now... ");
});
app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));

}

main().catch(console.error);

 