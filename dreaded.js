const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType } = require("@whiskeysockets/baileys");
const fs = require("fs");
const util = require("util");
const chalk = require("chalk");
const speed = require("performance-now");
const { smsg, formatp, tanggal, formatDate, getTime, sleep, clockString, fetchJson, getBuffer, jsonformat, generateProfilePicture, parseMention, getRandom } = require('./Lib/Func.js');
const { exec, spawn, execSync } = require("child_process");
const uploadtoimgur = require('./Lib/Imgur');
const { readFileSync } = require('fs'); 

const path = require('path');
const { commands, aliases, totalCommands } = require('./Handler/commandHandler');
const status_saver = require('./Functions/status_saver');
const mongoose = require("mongoose");

const { findClosestCommand } = require('./Handler/similarityHandler');

module.exports = dreaded = async (client, m, chatUpdate, store) => {
  try {

const pict = await fs.readFileSync('./dreaded.jpg');
    const { getSettings } = require('./Mongodb/Settingsdb');
    const settings = await getSettings();
    const { botname, mycode } = require('./config');

    const {
      presence, autoread, mode, prefix, packname,
      dev, gcpresence, antionce, antitag
    } = settings;

    var body = m.mtype === "conversation"
      ? m.message.conversation
      : m.mtype === "imageMessage"
      ? m.message.imageMessage.caption
      : m.mtype === "extendedTextMessage"
      ? m.message.extendedTextMessage.text
      : "";

    var msgDreaded = m.message.extendedTextMessage?.contextInfo?.quotedMessage;
    var budy = typeof m.text == "string" ? m.text : "";

    const timestamp = speed();
    const dreadedspeed = speed() - timestamp;

    const cmd = body.startsWith(prefix) ? body.slice(prefix.length).trim().split(/\s+/)[0].toLowerCase() : null;

    const args = body.trim().split(/ +/).slice(1);
    const pushname = m.pushName || "No Name";
    const botNumber = await client.decodeJid(client.user.id);
    const itsMe = m.sender == botNumber ? true : false;
    let text = (q = args.join(" "));
    const arg = budy.trim().substring(budy.indexOf(" ") + 1);
    const arg1 = arg.trim().substring(arg.indexOf(" ") + 1);

    const getGroupAdmins = (participants) => { 
      let admins = []; 
      for (let i of participants) { 
        i.admin === "superadmin" ? admins.push(i.id) : i.admin === "admin" ? admins.push(i.id) : ""; 
      } 
      return admins || []; 
    };

    const fortu = (m.quoted || m);
    const quoted = (fortu.mtype == 'buttonsMessage') ? fortu[Object.keys(fortu)[1]] : 
                   (fortu.mtype == 'templateMessage') ? fortu.hydratedTemplate[Object.keys(fortu.hydratedTemplate)[1]] : 
                   (fortu.mtype == 'product') ? fortu[Object.keys(fortu)[0]] : m.quoted ? m.quoted : m;

    const color = (text, color) => {
      return !color ? chalk.green(text) : chalk.keyword(color)(text);
    };

    const mime = (quoted.msg || quoted).mimetype || "";
    const qmsg = (quoted.msg || quoted);

    const DevDreaded = dev.split(",");
    const Owner = DevDreaded.map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender);

    const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch((e) => {}) : "";
    const groupName = m.isGroup ? groupMetadata.subject : "";
    const participants = m.isGroup ? await groupMetadata.participants : ""; 
    const groupAdmin = m.isGroup ? await getGroupAdmins(participants) : ""; 
    const isBotAdmin = m.isGroup ? groupAdmin.includes(botNumber) : false; 
    const isAdmin = m.isGroup ? groupAdmin.includes(m.sender) : false;

    const IsGroup = m.chat?.endsWith("@g.us");

    const context = {
    client, m, text, Owner, chatUpdate, store, isBotAdmin, isAdmin, IsGroup, participants, mycode,
    pushname, body, budy, totalCommands, args, mime, qmsg, msgDreaded, botNumber, itsMe,
    packname, generateProfilePicture, groupMetadata, dreadedspeed,
    fetchJson, exec, getRandom, prefix, cmd, botname, mode, gcpresence, getGroupAdmins, antionce, pict, uploadtoimgur
};

if (cmd && settings.mode === 'private' && !itsMe && !Owner) {
    return;
}

await status_saver(client, m, Owner, prefix);

const commandName = body.startsWith(prefix) 
    ? body.slice(prefix.length).trim().split(/\s+/)[0].toLowerCase() 
    : null;

if (commandName) {
    const resolvedCommandName = aliases[commandName] || commandName;

    if (commands[resolvedCommandName]) {
        await commands[resolvedCommandName](context);
    } else {
        console.log(`Command not found: ${commandName}`);
    }
} else {
    console.log("No command found in message.");
}


  } catch (err) {
    console.error("Error:", err);
  }

  process.on('uncaughtException', function (errr) {
    let e = String(errr);
    if (e.includes("conflict")) return;
    if (e.includes("not-authorized")) return;
    if (e.includes("Socket connection timeout")) return;
    if (e.includes("rate-overlimit")) return;
    if (e.includes("Connection Closed")) return;
    if (e.includes("Timed Out")) return;
    if (e.includes("Value not found")) return;
    console.log('Caught exception: ', errr);
  });
};